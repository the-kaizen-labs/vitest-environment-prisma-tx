import type { Environment } from 'vitest/environments';
import { builtinEnvironments } from 'vitest/environments';
import { createContext } from './context.js';
import type { PrismaEnvironmentOptions } from './dts/index.js';

const environmentName = 'prisma';

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
