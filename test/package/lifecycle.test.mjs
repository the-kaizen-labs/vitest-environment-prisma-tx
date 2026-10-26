import { afterAll, expect, test } from 'vitest';

test('uses the transaction client installed by the setup entry point', () => {
  expect(prismaTestContext.client.row.findMany()).toEqual([]);
  prismaTestContext.client.row.create('first test');
  expect(prismaTestContext.client.row.findMany()).toEqual(['first test']);
});

test('rolls back before starting the next test transaction', () => {
  expect(prismaTestContext.client.row.findMany()).toEqual([]);
  prismaTestContext.client.row.create('second test');
  expect(prismaTestContext.client.row.findMany()).toEqual(['second test']);
});

afterAll(() => {
  expect(() => prismaTestContext.client.row).toThrow(
    /outside of an active test transaction/,
  );
});
