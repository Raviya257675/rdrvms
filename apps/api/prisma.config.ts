import { defineConfig } from 'prisma/config';
import { loadLocalEnvironment } from './src/environment.js';
import { readDatabaseConfig } from './src/database-config.js';

loadLocalEnvironment();
const hasSettings = ['DATABASE_URL', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB']
  .some(key => process.env[key] !== undefined);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Generation needs no credentials. Runtime independently requires valid config.
  ...(hasSettings ? { datasource: { url: readDatabaseConfig(process.env).connectionString } } : {}),
});
