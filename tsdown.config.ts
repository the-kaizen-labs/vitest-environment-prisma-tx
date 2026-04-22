import { copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/setup.ts'],
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  dts: false,
  hooks: {
    'build:done': async (ctx) => {
      await copyFile(
        'src/dts/index.d.ts',
        join(ctx.options.outDir, 'index.d.ts'),
      );
    },
  },
});
