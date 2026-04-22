// Mirrors the globalThis-pinned instance array pattern used in
// test/prisma-client-stub.js so that modules imported via dynamic
// import() and via ESM in tests share the same instance registry.
if (!globalThis.__prismaAdapterStubInstances)
  globalThis.__prismaAdapterStubInstances = [];
export const prismaAdapterStubInstances =
  globalThis.__prismaAdapterStubInstances;

export class PrismaAdapterStub {
  constructor(options) {
    this.options = options;
    prismaAdapterStubInstances.push(this);
  }
}

// Default export: factory form so tests exercise the factory branch.
export default () =>
  new PrismaAdapterStub({ connectionString: process.env.DATABASE_URL });
