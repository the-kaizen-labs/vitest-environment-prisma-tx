import type { Environment } from 'vitest/runtime';

import { builtinEnvironments } from 'vitest/runtime';

import type { PrismaEnvironmentOptions } from './dts/index.js';

import { createContext } from './context.js';

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
