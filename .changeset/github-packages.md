---
'@the-kaizen-labs/vitest-environment-prisma-tx': patch
---

Distribute the environment as `@the-kaizen-labs/vitest-environment-prisma-tx` through GitHub Packages. Authenticated consumers can install it under the existing `vitest-environment-prisma-tx` dependency alias to retain their environment configuration, setup imports and global type references. The unscoped package on npm remains separate; transaction behavior and Vitest 4/5 compatibility are unchanged.
