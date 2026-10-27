import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const packageName = process.env.PRISMA_TX_PACKAGE_NAME;
if (!packageName) throw new Error('PRISMA_TX_PACKAGE_NAME is required');

export default defineConfig({
  test: {
    environment:
      packageName === 'vitest-environment-prisma-tx'
        ? 'prisma-tx'
        : fileURLToPath(import.meta.resolve(packageName)),
    environmentOptions: {
      'prisma-tx': {
        clientPath: './client.mjs',
        adapterPath: './adapter.mjs',
      },
    },
    setupFiles: [`${packageName}/setup`],
  },
});
