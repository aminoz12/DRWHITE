'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type ProductModelProps = {
  driftAmplitude: number;
  floatAmplitude: number;
  motionEnabled: boolean;
  phase: number;
  position: [number, number, number];
  rotation: [number, number, number];
  rotationSpeed: number;
  scale: number;
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updatePreference = () => setMatches(media.matches);

    updatePreference();

    if (media.addEventListener) {
      media.addEventListener('change', updatePreference);
      return () => media.removeEventListener('change', updatePreference);
    }

    media.addListener(updatePreference);
    return () => media.removeListener(updatePreference);
  }, [query]);

  return matches;
}

function FrameLimiter({ active, fps = 36 }: { active: boolean; fps?: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();

    if (!active) return undefined;

    const interval = window.setInterval(() => invalidate(), 1000 / fps);

    return () => window.clearInterval(interval);
  }, [active, fps, invalidate]);

  return null;
}

function ProductLighting({ motionEnabled }: { motionEnabled: boolean }) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const blueEdgeRef = useRef<THREE.PointLight>(null);
  const softSweepRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!motionEnabled) return;

    const time = clock.elapsedTime;

    if (keyLightRef.current) {
      keyLightRef.current.position.x = -4.3 + Math.sin(time * 0.36) * 0.45;
      keyLightRef.current.position.y = 5.2 + Math.cos(time * 0.3) * 0.28;
    }

    if (blueEdgeRef.current) {
      blueEdgeRef.current.intensity = 1.1 + Math.sin(time * 0.84) * 0.22;
    }

    if (softSweepRef.current) {
      softSweepRef.current.position.x = Math.sin(time * 0.55) * 2.7;
      softSweepRef.current.position.y = 1.1 + Math.cos(time * 0.42) * 0.35;
      softSweepRef.current.intensity = 0.72 + Math.sin(time * 0.72) * 0.18;
    }
  });

  return (
    <>
      <ambientLight intensity={0.82} />
      <directionalLight ref={keyLightRef} position={[-4.3, 5.2, 5.6]} intensity={3.2} />
      <spotLight position={[3.7, 4.1, 5]} angle={0.46} penumbra={0.8} intensity={3.4} color="#ffffff" />
      <pointLight ref={blueEdgeRef} position={[2.6, -0.1, 2.5]} intensity={1.1} color="#0068d7" />
      <pointLight ref={softSweepRef} position={[0, 1.1, 2.8]} intensity={0.72} color="#bfeaff" />
    </>
  );
}

function ProductModel({
  driftAmplitude,
  floatAmplitude,
  motionEnabled,
  phase,
  position,
  rotation,
  rotationSpeed,
  scale,
}: ProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const gl = useThree((state) => state.gl);
  const { scene } = useGLTF('/images/2-hero.glb');
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

    model.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (!mesh.isMesh) return;

      mesh.castShadow = false;
      mesh.receiveShadow = false;

      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        if (!material || !('roughness' in material)) return;

        const standardMaterial = material as THREE.MeshStandardMaterial;
        standardMaterial.color.set('#ffffff');
        standardMaterial.roughness = 0.38;
        standardMaterial.metalness = 0.025;
        standardMaterial.normalScale = new THREE.Vector2(0.78, 0.78);

        if (standardMaterial.map) {
          standardMaterial.map.colorSpace = THREE.SRGBColorSpace;
          standardMaterial.map.anisotropy = Math.min(maxAnisotropy, 16);
          standardMaterial.map.minFilter = THREE.LinearMipmapLinearFilter;
          standardMaterial.map.magFilter = THREE.LinearFilter;
          standardMaterial.map.generateMipmaps = true;
          standardMaterial.map.needsUpdate = true;
        }

        standardMaterial.needsUpdate = true;
      });
    });
  }, [gl, model]);

  useFrame(({ clock }) => {
    if (!motionEnabled || !groupRef.current) return;

    const time = clock.elapsedTime + phase;
    const revealEase = Math.sin(time * 0.42) * 0.07;

    groupRef.current.rotation.x = rotation[0] + Math.sin(time * 0.62) * 0.024;
    groupRef.current.rotation.y = rotation[1] + time * rotationSpeed + revealEase;
    groupRef.current.rotation.z = rotation[2] + Math.sin(time * 0.34) * 0.016;
    groupRef.current.position.x = position[0] + Math.sin(time * 0.38) * driftAmplitude;
    groupRef.current.position.y = position[1] + Math.sin(time * 0.72) * floatAmplitude;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

function Scene({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <>
      <FrameLimiter active={motionEnabled} />
      <ProductLighting motionEnabled={motionEnabled} />

      <Suspense fallback={null}>
        <ProductModel
          driftAmplitude={0.035}
          floatAmplitude={0.065}
          motionEnabled={motionEnabled}
          phase={0}
          position={[-0.42, -0.54, 0.1]}
          rotation={[0.035, 0.18, 0.035]}
          rotationSpeed={0.62}
          scale={1.68}
        />
        <ProductModel
          driftAmplitude={0.026}
          floatAmplitude={0.05}
          motionEnabled={motionEnabled}
          phase={1.45}
          position={[0.86, -0.62, -0.72]}
          rotation={[0.02, -0.58, 0.055]}
          rotationSpeed={-0.48}
          scale={1.34}
        />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        makeDefault
        maxPolarAngle={Math.PI / 1.68}
        minPolarAngle={Math.PI / 2.75}
        rotateSpeed={0.62}
        target={[0.12, -0.58, 0]}
      />
    </>
  );
}

export default function HeroProductScene() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div className="hero-product-scene relative h-[390px] sm:h-[460px] lg:h-[600px] w-full overflow-visible">
      <Canvas
        dpr={[1, 1.75]}
        frameloop="demand"
        camera={{ position: [0, 0.48, 7.25], fov: 34 }}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          scene.background = null;
          gl.setClearColor('#f6fbff', 0);
          gl.setClearAlpha(0);
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.14;
        }}
        className="!absolute inset-0"
      >
        <Scene motionEnabled={prefersReducedMotion !== true} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/images/2-hero.glb');
