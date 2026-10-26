import type { Environment } from 'vitest/runtime';

import type { PrismaEnvironmentOptions } from './dts/index.js';

import { createContext } from './context.js';

// Vitest 4.0 predates the runtime export; preserve its environment entry point.
const legacySpecifier = 'vitest/environments';
const { builtinEnvironments } = await import('vitest/runtime').catch(
  (error) => {
    if (
      error.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED' ||
      !error.message.includes("'./runtime'")
    )
      throw error;
    return import(legacySpecifier);
  },
);

const environmentName = 'prisma-tx';

const environment: Environment = {
  name: environmentName,
  viteEnvironment: 'ssr',

  async setup(global, opts: Record<string, any>) {
    const options: PrismaEnvironmentOptions = opts[environmentName];

    const ctx = await createContext(options);
    await ctx.setup();

    // make context available globally for setupFiles.
    global.prismaTestContext = ctx;

    const { teardown: nodeEnvironmentTeardown } =
      await builtinEnvironments.node.setup(global, {});

    return {
      async teardown(global) {
        await ctx.teardown();
        await nodeEnvironmentTeardown(global);
      },
    };
  },
};

export default environment;
