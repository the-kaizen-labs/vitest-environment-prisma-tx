import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = process.argv[2];
assert.match(
  version ?? '',
  /^\d+\.\d+\.\d+$/,
  'Supply an exact Vitest version',
);
const vite = process.argv[3];
assert.match(vite ?? '', /^\d+\.\d+\.\d+$/, 'Supply an exact Vite version');
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = mkdtempSync(join(tmpdir(), 'prisma-tx-package-'));
const artifact = join(directory, 'environment.tgz');
const run = (cwd, args, env = {}) => {
  const result = spawnSync('pnpm', args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  assert.equal(result.error, undefined);
  assert.equal(result.signal, null);
  assert.equal(result.status, 0, `pnpm ${args.join(' ')} failed`);
};

run(root, ['pack', '--out', artifact]);
const { name } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const [mode, packageName] of [
  ['scoped', name],
  ['alias', 'vitest-environment-prisma-tx'],
]) {
  const fixture = join(directory, mode);
  cpSync(join(root, 'test/package'), fixture, { recursive: true });
  writeFileSync(
    join(fixture, 'package.json'),
    JSON.stringify({
      name: `prisma-tx-packed-consumer-${mode}`,
      private: true,
      type: 'module',
      packageManager: 'pnpm@10.27.0',
      devDependencies: {
        [packageName]: `file:${artifact}`,
        vitest: version,
        vite,
        prisma: '7.8.0',
      },
    }),
  );
  run(fixture, ['install', '--ignore-scripts', '--strict-peer-dependencies']);
  run(fixture, ['install', '--frozen-lockfile', '--ignore-scripts']);
  run(fixture, ['exec', 'vitest', 'run', '--maxWorkers=2'], {
    PRISMA_TX_PACKAGE_NAME: packageName,
  });
  const metrics = JSON.parse(
    readFileSync(join(fixture, 'lifecycle.json'), 'utf8'),
  );
  assert.deepEqual(metrics, { connects: 1, disconnects: 1, rollbacks: 2 });
  console.log(
    `PASS: ${mode} packed environment/setup lifecycle on Vitest ${version}`,
  );
}
