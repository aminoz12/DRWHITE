import { existsSync, readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
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

if (!env.NODE_OPTIONS?.includes('--max-old-space-size')) {
  env.NODE_OPTIONS = `${env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ` : ''}--max-old-space-size=8192`;
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
