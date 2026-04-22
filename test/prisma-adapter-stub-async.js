import { PrismaAdapterStub } from './prisma-adapter-stub.js';

export default async () => new PrismaAdapterStub({ asyncFactory: true });
