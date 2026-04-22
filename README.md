<div align="center">
  <h1>vitest-environment-prisma-tx</h1>
  <a href="https://www.npmjs.com/package/vitest-environment-prisma-tx"><img src="https://img.shields.io/npm/v/vitest-environment-prisma-tx.svg?style=flat" /></a>
  <a href="https://github.com/the-kaizen-labs/vitest-environment-prisma-tx/blob/main/.github/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/the-kaizen-labs/vitest-environment-prisma-tx/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" /></a>
  <br />
  <br />
  <a href="#features">Features</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#installation--setup">Installation & Setup</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#typescript-configuration">TypeScript Configuration</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#known-limiations">Known Limitations</a>
  <br />
  <hr />
</div>

## Motivation

[Vitest](https://vitest.dev/) environment for [Prisma](https://www.prisma.io/) designed for fast integration tests.

Integration tests against a database are often slow because each test needs its own database state. Teams typically either:

- Reseed the database before every test, or
- Insert all required data inside each test.

Both approaches are slow, repetitive, and dominate test runtime.

**This environment eliminates that cost.**

You run migrations and seed your test database once.
Each test then runs inside its own database transaction, which is rolled back automatically after the test finishes. Your tests stay isolated, realistic, and extremely fast, creating dedicated data for every test.

The examples below use [`@prisma/adapter-pg`](https://www.npmjs.com/package/@prisma/adapter-pg) (PostgreSQL), but the environment itself is adapter-agnostic — bring your own Prisma driver adapter.

## Features

- Run integration tests against a real database via your Prisma adapter of choice.
- Seed your database once at the beginning of the test run.
- Tests run inside sandboxed transactions, but application-level transactions still work normally.
- Test transactions are rolled back after every test.
- Tests are isolated, fast, and order independent.

## Installation & Setup

> Requires Node.js 20 or newer (CI covers 20.x, 22.x, 24.x).

#### Step 1: Install the environment

Install the package as a dev dependency:

```shell
npm install vitest-environment-prisma-tx --save-dev
```

The package is named `vitest-environment-prisma-tx` so Vitest can resolve it from the `environment: 'prisma-tx'` setting in your config — Vitest looks up custom environments as `vitest-environment-<name>` ([Vitest docs](https://vitest.dev/guide/environment.html#custom-environment)).

#### Step 2: Ensure peer dependency availability

Then, ensure that the required peer dependencies are available. This library requires that you have all of the following installed in your project:

- `vitest` in version `4.x`
- `prisma` in version `7.x`
- Any Prisma driver adapter your database supports, installed as a direct dependency — e.g. `@prisma/adapter-pg` for PostgreSQL, `@prisma/adapter-planetscale` for PlanetScale, `@prisma/adapter-d1` for Cloudflare D1, etc.

#### Step 3: Enable and configure the environment in your Vitest config

Configure the environment in your Vitest config:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'prisma-tx',
    environmentOptions: {
      'prisma-tx': {
        // Path to your Prisma client.
        clientPath: './generated/prisma-client',
        // Path to the adapter module created in Step 4.
        adapterPath: './vitest.prisma-adapter.ts',
      },
    },
    setupFiles: [
      // Registers hooks that start and roll back a database transaction around every test.
      'vitest-environment-prisma-tx/setup',
      // This is where you mock your Prisma client to use the test environment's client.
      './vitest.setup.ts',
    ],
  },
});
```

#### Step 4: Create an adapter module

Create a small module that default-exports your Prisma driver adapter. The export can be either an adapter instance or a factory (sync or async) that returns one. The module's default export must be the adapter itself (or a factory returning one) — do not export the adapter class directly.

```ts
// vitest.prisma-adapter.ts
import { PrismaPg } from '@prisma/adapter-pg';
export default () =>
  new PrismaPg({ connectionString: process.env.DATABASE_URL! });
```

For dynamic setups (e.g. a Testcontainers-managed database), use an async factory:

```ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async () => {
  const container = await new PostgreSqlContainer().start();
  return new PrismaPg({ connectionString: container.getConnectionUri() });
};
```

Point `adapterPath` at this module from your Vitest config.

#### Step 5: Provide a connection string

Your adapter module is responsible for telling the Prisma driver adapter how to reach your test database. The most common pattern is to read `process.env.DATABASE_URL` inside the adapter module and run your tests with that variable set, but you can also use a literal string, a Testcontainers-provisioned URL (see Step 4), or any other dynamic source.

For PostgreSQL the connection string can point to:

- a real local PostgreSQL instance
- a docker-compose container
- a Testcontainers-created instance (see Step 4)
- a cloud-hosted PostgreSQL instance, e.g. Supabase or Prisma Postgres

#### Step 6: Mock Prisma client

In your setupFile, `vitest.setup.ts`, mock your local Prisma client with the client provided by this environment:

```ts
import { vi } from 'vitest';

vi.mock('./generated/prisma-client', () => ({
  default: prismaTestContext.client,
}));
```

This ensures that your application code uses the Prisma client created by the test environment. Combined with the `vitest-environment-prisma-tx/setup` file, which starts and rolls back a transaction around every test, this means all Prisma queries from your code run inside an isolated transaction per test.

Please make sure that you're mocking exactly the module path that your code is using to import your Prisma client.

#### Step 7: Seed once per test run

Make sure to seed your test database at the beginning of every test run.

## TypeScript configuration

If you are using TypeScript, make sure to add this environment to your `compilerOptions.types` array in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["node", "vitest/globals", "vitest-environment-prisma-tx"]
  }
}
```

This is required because this environment provides a global type declaration:

```ts
declare global {
  var prismaTestContext: PublicPrismaTestContext;
}
```

Without adding the package to `compilerOptions.types`, TypeScript will not include this global augmentation, and you will get type errors when mocking your Prisma client in `vitest.setup.ts`:

```ts
vi.mock('./generated/prisma-client', () => ({
  default: globalThis.prismaTestContext.client,
  //                  ^^^^^^^^^^^^^^^^^
  //                  Error: Element implicitly has an 'any' type because
  //                  type 'typeof globalThis' has no index signature.
}));
```

Adding `"vitest-environment-prisma-tx"` to `compilerOptions.types` ensures that the global declaration is loaded and the mock is type-safe.

## Known limitations

- Support for [Vitest pools](https://vitest.dev/config/pool.html#pool) set to `vmThreads` or `vmThreads` is not implemented
- This environment assumes that tests inside a single worker run one at a time:
  - Do not use `test.concurrent` for tests that touch the database.
  - Keep `maxConcurrency` at `1` for DB integration tests so a worker does not run multiple DB tests at once.

## License

MIT
