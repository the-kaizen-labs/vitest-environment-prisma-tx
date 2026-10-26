import { writeFileSync } from 'node:fs';

const metrics = { connects: 0, disconnects: 0, rollbacks: 0 };

export class PrismaClient {
  async $connect() {
    metrics.connects++;
  }

  async $disconnect() {
    metrics.disconnects++;
    writeFileSync('lifecycle.json', JSON.stringify(metrics));
  }

  async $transaction(callback) {
    const rows = [];
    const client = {
      row: {
        create(value) {
          rows.push(value);
        },
        findMany() {
          return [...rows];
        },
      },
    };
    try {
      return await callback(client);
    } catch (error) {
      metrics.rollbacks++;
      throw error;
    }
  }
}
