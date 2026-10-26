import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'prisma-tx',
    environmentOptions: {
      'prisma-tx': {
        clientPath: './client.mjs',
        adapterPath: './adapter.mjs',
      },
    },
    setupFiles: ['vitest-environment-prisma-tx/setup'],
  },
});
