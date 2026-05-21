import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { MeshoptSimplifier } from 'meshoptimizer';

const GL_FLOAT = 5126;
const GL_UNSIGNED_SHORT = 5123;
const GL_UNSIGNED_INT = 5125;
const GL_ARRAY_BUFFER = 34962;
const GL_ELEMENT_ARRAY_BUFFER = 34963;
const MISSING_VERTEX = 2 ** 32 - 1;

const assets = [
  { input: '2.glb', output: '2-hero.glb', ratio: 0.9, error: 0.004 },
];

function align4(value) {
  return (value + 3) & ~3;
}

function padBuffer(buffer, padValue = 0) {
  const padded = Buffer.alloc(align4(buffer.length), padValue);
  buffer.copy(padded);
  return padded;
}

function readGlb(buffer) {
  let offset = 12;
  let json = null;
  let bin = null;

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.readUInt32LE(offset + 4);
    offset += 8;

    const chunk = buffer.subarray(offset, offset + chunkLength);
    offset += chunkLength;

    if (chunkType === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8'));
    if (chunkType === 0x004e4942) bin = chunk;
  }

  if (!json || !bin) {
    throw new Error('Expected a binary GLB with JSON and BIN chunks.');
  }

  return { json, bin };
}

function accessorArray(json, bin, accessorIndex) {
  const accessor = json.accessors[accessorIndex];
  const view = json.bufferViews[accessor.bufferView];
  const componentCount = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[accessor.type];
  const componentSize = { [GL_FLOAT]: 4, [GL_UNSIGNED_SHORT]: 2, [GL_UNSIGNED_INT]: 4 }[accessor.componentType];
  const stride = view.byteStride || componentSize * componentCount;
  const start = (view.byteOffset || 0) + (accessor.byteOffset || 0);

  if (accessor.componentType === GL_FLOAT && stride === componentSize * componentCount) {
    return new Float32Array(bin.buffer, bin.byteOffset + start, accessor.count * componentCount).slice();
  }

  if (accessor.type !== 'SCALAR') {
    throw new Error(`Unsupported interleaved accessor type: ${accessor.type}`);
  }

  const out = new Uint32Array(accessor.count);

  for (let index = 0; index < accessor.count; index += 1) {
    const offset = start + index * stride;
    out[index] = accessor.componentType === GL_UNSIGNED_SHORT ? bin.readUInt16LE(offset) : bin.readUInt32LE(offset);
  }

  return out;
}

function minMax(array, components) {
  const min = Array.from({ length: components }, () => Infinity);
  const max = Array.from({ length: components }, () => -Infinity);

  for (let index = 0; index < array.length / components; index += 1) {
    for (let component = 0; component < components; component += 1) {
      const value = array[index * components + component];
      if (value < min[component]) min[component] = value;
      if (value > max[component]) max[component] = value;
    }
  }

  return { min, max };
}

function typedArrayBuffer(array) {
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength);
}

function makeIndexBuffer(indices, componentType) {
  if (componentType === GL_UNSIGNED_SHORT) {
    const out = new Uint16Array(indices.length);
    out.set(indices);
    return typedArrayBuffer(out);
  }

  const out = new Uint32Array(indices.length);
  out.set(indices);
  return typedArrayBuffer(out);
}

function addBufferView(parts, buffer, target) {
  const byteOffset = parts.byteLength;
  const padded = padBuffer(buffer);
  parts.buffers.push(padded);
  parts.byteLength += padded.length;

  const view = { buffer: 0, byteOffset, byteLength: buffer.length };
  if (target) view.target = target;
  return view;
}

async function optimizeAsset({ input, output, ratio, error: targetError }) {
  const inputPath = resolve('public', 'images', input);
  const outputPath = resolve('public', 'images', output);
  const source = await readFile(inputPath);
  const { json, bin } = readGlb(source);
  const primitive = json.meshes[0].primitives[0];
  const positions = accessorArray(json, bin, primitive.attributes.POSITION);
  const uvs = accessorArray(json, bin, primitive.attributes.TEXCOORD_0);
  const normals = accessorArray(json, bin, primitive.attributes.NORMAL);
  const indices = accessorArray(json, bin, primitive.indices);
  const attributes = new Float32Array((positions.length / 3) * 5);

  for (let index = 0; index < positions.length / 3; index += 1) {
    attributes[index * 5] = normals[index * 3];
    attributes[index * 5 + 1] = normals[index * 3 + 1];
    attributes[index * 5 + 2] = normals[index * 3 + 2];
    attributes[index * 5 + 3] = uvs[index * 2];
    attributes[index * 5 + 4] = uvs[index * 2 + 1];
  }

  const targetIndexCount = Math.floor((indices.length * ratio) / 3) * 3;
  const [simplifiedRaw, error] = MeshoptSimplifier.simplifyWithAttributes(
    indices,
    positions,
    3,
    attributes,
    5,
    [0.15, 0.15, 0.15, 1, 1],
    null,
    targetIndexCount,
    targetError,
    ['Permissive'],
  );

  const simplifiedIndices = new Uint32Array(simplifiedRaw);
  const [remap, vertexCount] = MeshoptSimplifier.compactMesh(simplifiedIndices);
  const nextPositions = new Float32Array(vertexCount * 3);
  const nextUvs = new Float32Array(vertexCount * 2);
  const nextNormals = new Float32Array(vertexCount * 3);

  for (let oldIndex = 0; oldIndex < remap.length; oldIndex += 1) {
    const nextIndex = remap[oldIndex];
    if (nextIndex === MISSING_VERTEX) continue;

    nextPositions.set(positions.subarray(oldIndex * 3, oldIndex * 3 + 3), nextIndex * 3);
    nextUvs.set(uvs.subarray(oldIndex * 2, oldIndex * 2 + 2), nextIndex * 2);
    nextNormals.set(normals.subarray(oldIndex * 3, oldIndex * 3 + 3), nextIndex * 3);
  }

  const indexComponentType = vertexCount <= 65535 ? GL_UNSIGNED_SHORT : GL_UNSIGNED_INT;
  const parts = { buffers: [], byteLength: 0 };
  const bufferViews = [
    addBufferView(parts, makeIndexBuffer(simplifiedIndices, indexComponentType), GL_ELEMENT_ARRAY_BUFFER),
    addBufferView(parts, typedArrayBuffer(nextPositions), GL_ARRAY_BUFFER),
    addBufferView(parts, typedArrayBuffer(nextUvs), GL_ARRAY_BUFFER),
    addBufferView(parts, typedArrayBuffer(nextNormals), GL_ARRAY_BUFFER),
  ];

  json.images.forEach((image) => {
    const sourceView = json.bufferViews[image.bufferView];
    const start = sourceView.byteOffset || 0;
    const bytes = bin.subarray(start, start + sourceView.byteLength);
    bufferViews.push(addBufferView(parts, bytes));
  });

  const posRange = minMax(nextPositions, 3);
  const uvRange = minMax(nextUvs, 2);
  const normalRange = minMax(nextNormals, 3);
  const indexRange = minMax(simplifiedIndices, 1);
  const nextJson = {
    asset: { ...json.asset, generator: 'Codex hero optimizer + meshoptimizer' },
    scene: json.scene ?? 0,
    scenes: json.scenes,
    nodes: json.nodes,
    meshes: [
      {
        ...json.meshes[0],
        primitives: [
          {
            ...primitive,
            attributes: { POSITION: 0, NORMAL: 2, TEXCOORD_0: 1 },
            indices: 3,
          },
        ],
      },
    ],
    accessors: [
      { bufferView: 1, byteOffset: 0, componentType: GL_FLOAT, count: vertexCount, type: 'VEC3', min: posRange.min, max: posRange.max },
      { bufferView: 2, byteOffset: 0, componentType: GL_FLOAT, count: vertexCount, type: 'VEC2', min: uvRange.min, max: uvRange.max },
      { bufferView: 3, byteOffset: 0, componentType: GL_FLOAT, count: vertexCount, type: 'VEC3', min: normalRange.min, max: normalRange.max },
      { bufferView: 0, byteOffset: 0, componentType: indexComponentType, count: simplifiedIndices.length, type: 'SCALAR', min: indexRange.min, max: indexRange.max },
    ],
    bufferViews,
    buffers: [{ byteLength: parts.byteLength }],
    materials: json.materials,
    textures: json.textures,
    images: json.images.map((image, index) => ({ ...image, bufferView: 4 + index })),
    samplers: json.samplers,
  };

  ['extensionsUsed', 'extensionsRequired'].forEach((key) => {
    if (json[key]) nextJson[key] = json[key];
  });

  const jsonBuffer = Buffer.from(JSON.stringify(nextJson));
  const paddedJson = padBuffer(jsonBuffer, 0x20);
  const binBuffer = padBuffer(Buffer.concat(parts.buffers, parts.byteLength));
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + paddedJson.length + 8 + binBuffer.length, 8);

  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(paddedJson.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binBuffer.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  const outputBuffer = Buffer.concat([header, jsonHeader, paddedJson, binHeader, binBuffer]);
  await writeFile(outputPath, outputBuffer);

  return {
    input,
    output,
    inputMB: +(source.length / 1024 / 1024).toFixed(2),
    outputMB: +(outputBuffer.length / 1024 / 1024).toFixed(2),
    inputTriangles: indices.length / 3,
    outputTriangles: simplifiedIndices.length / 3,
    inputVertices: positions.length / 3,
    outputVertices: vertexCount,
    error,
  };
}

await MeshoptSimplifier.ready;

const results = [];
for (const asset of assets) {
  results.push(await optimizeAsset(asset));
}

console.table(results);
