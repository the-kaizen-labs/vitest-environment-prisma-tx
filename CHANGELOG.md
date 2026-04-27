# vitest-environment-prisma-tx

## 1.0.1

### Patch Changes

- cdf280c: Bump dev dependencies (`prisma` 7.2.0 → 7.8.0, `vitest` + `@vitest/coverage-v8` 4.0.16 → 4.1.5, `tsdown` 0.21.7 → 0.21.10) to clear 14 transitive Dependabot alerts (hono, vite, effect, defu, picomatch, lodash). No runtime or peer-dependency changes.

## 1.0.0

### Major Changes

- 5ec6e29: Initial release. A Vitest 4 custom environment for fast Prisma integration tests: each test runs inside an interactive Prisma transaction that is rolled back automatically, keeping tests isolated without per-test reseeding. Adapter-agnostic — bring any Prisma driver adapter (`@prisma/adapter-pg`, `@prisma/adapter-planetscale`, etc.) and wire it up via `environmentOptions['prisma-tx'].adapterPath`.
