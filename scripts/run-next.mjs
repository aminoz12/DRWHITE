import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { totalmem } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [, , command = 'dev', ...args] = process.argv;

function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};

  return readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return env;

      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) return env;

      const key = trimmed.slice(0, equalsIndex).trim();
      let value = trimmed.slice(equalsIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      env[key] = value;
      return env;
    }, {});
}

const localEnv = parseEnvFile(resolve(root, '.env.local'));
const extraCaCert =
  process.env.NODE_EXTRA_CA_CERTS ||
  localEnv.LOCAL_NODE_EXTRA_CA_CERTS ||
  localEnv.NODE_EXTRA_CA_CERTS;

const env = { ...process.env };

if (extraCaCert) {
  env.NODE_EXTRA_CA_CERTS = resolve(root, extraCaCert);
}

// Heap cap for Next and every child it spawns (Turbopack's PostCSS workers
// inherit NODE_OPTIONS). V8 sizes each process's young generation from this
// cap, so a fixed 8 GB on a small machine makes those workers fail to commit
// memory and die mid-compile ("failed to receive message … os error 10054" on
// globals.css). Scale it to the machine: ~2 GB on a 3.4 GB laptop, the full
// 8 GB on large build machines.
if (!env.NODE_OPTIONS?.includes('--max-old-space-size')) {
  const totalMb = Math.floor(totalmem() / 1024 / 1024);
  const heapMb = Math.max(1024, Math.min(8192, Math.floor(totalMb * 0.6)));
  env.NODE_OPTIONS = `${env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ` : ''}--max-old-space-size=${heapMb}`;
}

const nextBin = resolve(root, 'node_modules', 'next', 'dist', 'bin', 'next');
const child = spawn(process.execPath, [nextBin, command, ...args], {
  cwd: root,
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
