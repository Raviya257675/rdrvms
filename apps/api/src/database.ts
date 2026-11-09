import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import type { DatabaseConfig } from './database-config.js';
import { createReadinessCheck } from './health.js';

export function createDatabase(configuration: DatabaseConfig) {
  const adapter = new PrismaPg({
    connectionString: configuration.connectionString,
    max: 5,
    connectionTimeoutMillis: 1000,
    query_timeout: 1000,
    statement_timeout: 1000,
    idleTimeoutMillis: 10_000,
    application_name: 'rdrvms-api',
  });
  const client = new PrismaClient({ adapter, log: [] });
  const probe = createReadinessCheck(() => client.$queryRaw`SELECT 1`);
  let closing = false;
  let disconnected: Promise<void> | undefined;

  return {
    client,
    async isReady(): Promise<boolean> {
      if (closing) return false;
      const ready = await probe();
      return ready && !closing;
    },
    disconnect(): Promise<void> {
      closing = true;
      disconnected ??= client.$disconnect();
      return disconnected;
    },
  };
}
