---
'vitest-environment-prisma-tx': minor
---

Support Vitest 5 while retaining Vitest 4 compatibility. Use the current runtime environment API when available and retain the legacy entry point for Vitest 4.0. Vitest 5 consumers require Node.js 22.12 or newer; existing Vitest 4 consumers can continue using Node.js 20.
