# Changelog

## 2.0.0

### Major Changes

- d19545a: Pluggable Prisma driver adapter. New required `adapterPath` option points at a module that default-exports an adapter instance or a nullary factory (sync or async). `clientPath` now loads via dynamic `import()` with path normalization, fixing Prisma 7 `prisma-client` generator compatibility. Removes the `databaseUrl` option, the `DATABASE_URL` startup guard, and the `@prisma/adapter-pg` peer dependency.

  ### Migration

  Create an adapter module:

  ```ts
  // vitest.prisma-adapter.ts
  import { PrismaPg } from '@prisma/adapter-pg';
  export default () =>
    new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  ```

  Add `adapterPath` to your Vitest config:

  ```ts
  environmentOptions: {
    prisma: {
      clientPath: './src/generated/prisma/client.ts',
      adapterPath: './vitest.prisma-adapter.ts',
    },
  }
  ```

All notable changes to this project will be documented in this file.

This package was forked from
[`vitest-environment-prisma-postgres`](https://github.com/codepunkt/vitest-environment-prisma-postgres)
at upstream version `v1.0.1`. Releases prior to that point are not tracked in
this changelog.
