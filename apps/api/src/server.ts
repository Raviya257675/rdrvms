import { createServer } from 'node:http';
import { createApp } from './app.js';
import { readConfig, type Config } from './config.js';
import { createShutdown } from './shutdown.js';
import { createDatabase } from './database.js';
import { readDatabaseConfig } from './database-config.js';
import { loadLocalEnvironment } from './environment.js';

function main(): void {
  let config: Config;
  let database: ReturnType<typeof createDatabase>;
  try {
    loadLocalEnvironment();
    config = readConfig(process.env);
    database = createDatabase(readDatabaseConfig(process.env));
  } catch {
    console.error('API configuration is invalid. Check HTTP and database settings.');
    process.exitCode = 1;
    return;
  }

  const server = createServer(createApp(undefined, database.isReady));
  const shutdown = createShutdown(server, 10_000, {
    close: database.disconnect,
    forceExit: () => process.exit(1),
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.once('error', () => {
    console.error('API server failed.');
    process.exitCode = 1;
    shutdown();
  });
  server.listen(config.port, config.host, () => {
    console.info(`API listening on ${config.host}:${config.port}`);
  });
}

main();
