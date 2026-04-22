---
'vitest-prisma': major
---

Pluggable Prisma driver adapter. New required `adapterPath` option points at a module that default-exports an adapter instance or a nullary factory (sync or async). `clientPath` now loads via dynamic `import()` with path normalization, fixing Prisma 7 `prisma-client` generator compatibility. Removes the `databaseUrl` option, the `DATABASE_URL` startup guard, and the `@prisma/adapter-pg` peer dependency.

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
