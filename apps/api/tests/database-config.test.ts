import { describe, expect, it } from 'vitest';
import { readDatabaseConfig } from '../src/database-config.js';

describe('DBR-003: NFR-017 safe database configuration', () => {
  const components = { POSTGRES_USER: 'fictional user', POSTGRES_PASSWORD: 'fictional:@/% value', POSTGRES_DB: 'fictional database' };

  it('uses DATABASE_URL when supplied', () => {
    const connectionString = 'postgresql://fictional:fictional@127.0.0.1:5432/demo?sslmode=require';
    expect(readDatabaseConfig({ DATABASE_URL: connectionString }).connectionString).toBe(connectionString);
  });

  it('derives a URL from existing Compose variables and safely encodes components', () => {
    const url = new URL(readDatabaseConfig(components).connectionString);
    expect(url.hostname).toBe('127.0.0.1');
    expect(url.port).toBe('5432');
    expect(decodeURIComponent(url.username)).toBe(components.POSTGRES_USER);
    expect(decodeURIComponent(url.password)).toBe(components.POSTGRES_PASSWORD);
    expect(decodeURIComponent(url.pathname.slice(1))).toBe(components.POSTGRES_DB);
  });

  it('supports explicit database host and port independently of HTTP settings', () => {
    const url = new URL(readDatabaseConfig({ ...components, POSTGRES_HOST: 'localhost', POSTGRES_PORT: '5433', HOST: 'unrelated-http-host', PORT: '3001' }).connectionString);
    expect(url.hostname).toBe('localhost');
    expect(url.port).toBe('5433');
  });

  it.each([
    {}, { POSTGRES_USER: 'fictional' },
    { DATABASE_URL: '' }, { DATABASE_URL: 'synthetic private invalid value' },
    { DATABASE_URL: 'https://fictional:fictional@localhost/demo' },
    { DATABASE_URL: 'postgresql://localhost/' },
    { DATABASE_URL: 'postgresql://localhost/demo?statement_timeout=0' },
    { DATABASE_URL: 'postgresql://localhost/demo?query_timeout=0' },
    { DATABASE_URL: 'postgresql://localhost/demo?connectionTimeoutMillis=0' },
    { DATABASE_URL: 'postgresql://localhost/demo?options=-c%20statement_timeout%3D0' },
    { ...components, POSTGRES_PORT: '5432x' },
    { ...components, POSTGRES_PORT: '65536' },
    { ...components, POSTGRES_HOST: 'bad host' },
  ])('rejects missing/invalid configuration using only a fixed diagnostic', (environment) => {
    let message = '';
    try { readDatabaseConfig(environment); } catch (error) { message = (error as Error).message; }
    expect(message).toBe('Database configuration is invalid.');
  });
});
