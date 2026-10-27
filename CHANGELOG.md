# vitest-environment-prisma-tx

## 1.1.1

### Patch Changes

- 52ea556: Distribute the environment as `@the-kaizen-labs/vitest-environment-prisma-tx` through GitHub Packages. Authenticated consumers can install it under the existing `vitest-environment-prisma-tx` dependency alias to retain their environment configuration, setup imports and global type references. The unscoped package on npm remains separate; transaction behavior and Vitest 4/5 compatibility are unchanged.

## 1.1.0

### Minor Changes

- 2ba6fcb: Support Vitest 5 while retaining Vitest 4 compatibility. Use the current runtime environment API when available and retain the legacy entry point for Vitest 4.0. Vitest 5 consumers require Node.js 22.12 or newer; existing Vitest 4 consumers can continue using Node.js 20.

## 1.0.1

### Patch Changes

- cdf280c: Bump dev dependencies (`prisma` 7.2.0 → 7.8.0, `vitest` + `@vitest/coverage-v8` 4.0.16 → 4.1.5, `tsdown` 0.21.7 → 0.21.10) to clear 14 transitive Dependabot alerts (hono, vite, effect, defu, picomatch, lodash). No runtime or peer-dependency changes.

## 1.0.0

### Major Changes

- 5ec6e29: Initial release. A Vitest 4 custom environment for fast Prisma integration tests: each test runs inside an interactive Prisma transaction that is rolled back automatically, keeping tests isolated without per-test reseeding. Adapter-agnostic — bring any Prisma driver adapter (`@prisma/adapter-pg`, `@prisma/adapter-planetscale`, etc.) and wire it up via `environmentOptions['prisma-tx'].adapterPath`.
