---
'vitest-environment-prisma-tx': major
---

Initial release. A Vitest 4 custom environment for fast Prisma integration tests: each test runs inside an interactive Prisma transaction that is rolled back automatically, keeping tests isolated without per-test reseeding. Adapter-agnostic — bring any Prisma driver adapter (`@prisma/adapter-pg`, `@prisma/adapter-planetscale`, etc.) and wire it up via `environmentOptions['prisma-tx'].adapterPath`.
