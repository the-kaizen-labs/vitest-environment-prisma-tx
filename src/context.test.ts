import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type PrismaClient as PrismaClientStub,
  prismaClientStubInstances,
} from '../test/prisma-client-stub.js';
import { prismaAdapterStubInstances } from '../test/prisma-adapter-stub.js';
import { createContext } from './context.js';

const makeContext = async (
  transaction:
    | 'transactionPending'
    | 'transactionStarted'
    | 'transactionEnded' = 'transactionPending',
): Promise<[Awaited<ReturnType<typeof createContext>>, PrismaClientStub]> => {
  const context = await createContext({
    clientPath: './test/prisma-client-stub.js',
    adapterPath: './test/prisma-adapter-stub.js',
    log: ['query'],
    transactionOptions: { timeout: 123 },
  });
  await context.setup();
  if (transaction !== 'transactionPending') {
    await context.beginTestTransaction();
    if (transaction === 'transactionEnded') {
      context.endTestTransaction();
    }
  }
  return [context, prismaClientStubInstances.at(-1)!];
};

describe('createContext', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('creates the Prisma client with an adapter from adapterPath', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    const [ctx] = await makeContext();

    expect(prismaAdapterStubInstances.at(-1)?.options).toEqual({
      connectionString: 'postgres://fake',
    });

    await ctx.teardown();
  });

  it('accepts an adapter module whose default export is an instance', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    const ctx = await createContext({
      clientPath: './test/prisma-client-stub.js',
      adapterPath: './test/prisma-adapter-stub-instance.js',
      log: ['query'],
      transactionOptions: { timeout: 123 },
    });
    await ctx.setup();

    const latest = prismaAdapterStubInstances.at(-1);
    expect(latest?.options).toEqual({ instanceForm: true });

    await ctx.teardown();
  });

  it('awaits async adapter factories from adapterPath', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    const ctx = await createContext({
      clientPath: './test/prisma-client-stub.js',
      adapterPath: './test/prisma-adapter-stub-async.js',
      log: ['query'],
      transactionOptions: { timeout: 123 },
    });
    await ctx.setup();

    const latest = prismaAdapterStubInstances.at(-1);
    expect(latest?.options).toEqual({ asyncFactory: true });

    await ctx.teardown();
  });

  it('accepts an absolute file:// URL as adapterPath', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    const adapterFileUrl = pathToFileURL(
      resolve('./test/prisma-adapter-stub.js'),
    ).href;
    const ctx = await createContext({
      clientPath: './test/prisma-client-stub.js',
      adapterPath: adapterFileUrl,
      log: ['query'],
      transactionOptions: { timeout: 123 },
    });
    await ctx.setup();

    expect(prismaAdapterStubInstances.at(-1)?.options).toEqual({
      connectionString: 'postgres://fake',
    });

    await ctx.teardown();
  });

  it('accepts an absolute file:// URL as clientPath', async () => {
    vi.stubEnv('DATABASE_URL', 'postgres://fake');
    const fileUrl = pathToFileURL(resolve('./test/prisma-client-stub.js')).href;
    const ctx = await createContext({
      clientPath: fileUrl,
      adapterPath: './test/prisma-adapter-stub.js',
      log: ['query'],
      transactionOptions: { timeout: 123 },
    });
    await ctx.setup();

    expect(prismaAdapterStubInstances.at(-1)?.options).toEqual({
      connectionString: 'postgres://fake',
    });

    await ctx.teardown();
  });

  it('throws when client is accessed outside of a test transaction', async () => {
    const [transactionPendingContext] = await makeContext('transactionPending');
    const [transactionEndedContext] = await makeContext('transactionEnded');

    expect(() =>
      transactionPendingContext.client.$transaction(async () => {}),
    ).toThrow(
      /prismaTestContext\.client was accessed outside of an active test transaction/,
    );
    expect(() =>
      transactionEndedContext.client.$transaction(async () => {}),
    ).toThrow(
      /prismaTestContext\.client was accessed outside of an active test transaction/,
    );
  });

  it('allows client access inside of a test transaction', async () => {
    const [transactionStartedContext] = await makeContext('transactionStarted');
    expect(() =>
      transactionStartedContext.client.$transaction(async () => {}),
    ).not.toThrow();
  });

  it('throws when test transaction is started twice for the same context', async () => {
    const [transactionStartedContext] = await makeContext('transactionStarted');
    await expect(
      transactionStartedContext.beginTestTransaction(),
    ).rejects.toThrow(
      /beginTestTransaction called while a test transaction is already active/,
    );
  });

  it('nested $transaction uses SAVEPOINT/RELEASE on success', async () => {
    const [ctx, prisma] = await makeContext('transactionStarted');

    await ctx.client.$transaction([
      Promise.resolve(1),
      Promise.resolve(2),
    ] as any);

    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/^SAVEPOINT vitest_prisma_/),
    );
    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/^RELEASE SAVEPOINT vitest_prisma_/),
    );
  });

  it('nested $transaction rolls back to savepoint on error', async () => {
    const [ctx, prisma] = await makeContext('transactionStarted');

    await expect(
      ctx.client.$transaction(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/^SAVEPOINT vitest_prisma_/),
    );
    expect(prisma.$executeRawUnsafe).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/^ROLLBACK TO SAVEPOINT vitest_prisma_/),
    );
  });

  it('forwards function properties other than $transaction from the transaction client', async () => {
    const [ctx, prisma] = await makeContext('transactionStarted');

    expect(prisma.$connect).toHaveBeenCalledTimes(1);

    // And calling via ctx.client directly should also work
    await ctx.client.$disconnect();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('forwards non-function properties from the transaction client', async () => {
    const [ctx, prisma] = await makeContext('transactionStarted');
    expect(prisma.meta).toEqual((ctx.client as PrismaClientStub).meta);
  });
});
