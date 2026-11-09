import { createServer } from 'node:http';
import { createApp } from './app.js';
import { readConfig, type Config } from './config.js';
import { createShutdown } from './shutdown.js';

function main(): void {
  let config: Config;
  try {
    config = readConfig(process.env);
  } catch {
    console.error('API configuration is invalid. Check HOST and PORT.');
    process.exitCode = 1;
    return;
  }

  const server = createServer(createApp());
  const shutdown = createShutdown(server);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  server.once('error', () => {
    console.error('API server failed.');
    process.exitCode = 1;
  });
  server.listen(config.port, config.host, () => {
    console.info(`API listening on ${config.host}:${config.port}`);
  });
}

main();
