import { once } from 'node:events';
import { createServer, connect, type Socket } from 'node:net';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { createDatabase } from '../../src/database.js';
import { readDatabaseConfig, type DatabaseConfig } from '../../src/database-config.js';
import { loadLocalEnvironment } from '../../src/environment.js';

describe('DBR-005: FR-029 / AT-029 real PostgreSQL connectivity (SELECT only)', () => {
  let configuration: DatabaseConfig;
  beforeAll(() => {
    loadLocalEnvironment();
    configuration = readDatabaseConfig(process.env);
  });

  async function proxy(blackHole = false) {
    const target = new URL(configuration.connectionString);
    const upstreamHost = target.hostname.replace(/^\[|\]$/g, '');
    const upstreamPort = Number(target.port || 5432);
    const sockets = new Set<Socket>();
    let available = true;
    const server = createServer(incoming => {
      sockets.add(incoming);
      incoming.on('close', () => sockets.delete(incoming));
      incoming.on('error', () => incoming.destroy());
      if (!available) { incoming.destroy(); return; }
      if (blackHole) return;
      const upstream = connect(upstreamPort, upstreamHost);
      sockets.add(upstream);
      upstream.on('close', () => { sockets.delete(upstream); incoming.destroy(); });
      upstream.on('error', () => { upstream.destroy(); incoming.destroy(); });
      incoming.on('close', () => upstream.destroy());
      incoming.pipe(upstream).pipe(incoming);
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (address === null || typeof address === 'string') throw new Error('Test proxy did not bind.');
    target.hostname = '127.0.0.1'; target.port = String(address.port);
    return {
      configuration: { connectionString: target.toString() },
      setAvailable(value: boolean) {
        available = value;
        if (!value) for (const socket of sockets) socket.destroy();
      },
      async close() {
        for (const socket of sockets) socket.destroy();
        await new Promise<void>(resolve => server.close(() => resolve()));
      },
    };
  }

  it('queries actual PostgreSQL, serves readiness and disconnects idempotently', async () => {
    const database = createDatabase(configuration);
    try {
      expect(await database.isReady()).toBe(true);
      const rows = await database.client.$queryRaw`SELECT 1 AS ok`
        .catch(() => { throw new Error('Read-only connectivity query failed.'); });
      expect(rows).toEqual([{ ok: 1 }]);
      const response = await request(createApp(undefined, database.isReady)).get('/health/ready');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ready' });
    } finally { await database.disconnect(); }
    await database.disconnect();
    expect(await database.isReady()).toBe(false);
  });

  it('returns 200 -> 503 -> 200 for the same client across a real network outage', async () => {
    const network = await proxy();
    const database = createDatabase(network.configuration);
    try {
      const app = createApp(undefined, database.isReady);
      expect((await request(app).get('/health/ready')).status).toBe(200);
      network.setAvailable(false);
      const failed = await request(app).get('/health/ready');
      expect(failed.status).toBe(503);
      expect(failed.body).toEqual({ error: {
        code: 'NOT_READY', message: 'Service is not ready.', requestId: expect.any(String),
      } });
      expect((await request(app).get('/health/live')).body).toEqual({ status: 'ok' });
      network.setAvailable(true);
      expect((await request(app).get('/health/ready')).status).toBe(200);
    } finally { await database.disconnect(); await network.close(); }
  });

  it('bounds a stalled PostgreSQL handshake and keeps liveness independent', async () => {
    const network = await proxy(true);
    const database = createDatabase(network.configuration);
    try {
      const app = createApp(undefined, database.isReady);
      const before = performance.now();
      const response = await request(app).get('/health/ready');
      expect(response.status).toBe(503);
      expect(performance.now() - before).toBeLessThan(2500);
      expect(response.body.error.code).toBe('NOT_READY');
      const live = await request(app).get('/health/live');
      expect(live.status).toBe(200);
      expect(live.body).toEqual({ status: 'ok' });
    } finally { await database.disconnect(); await network.close(); }
  });
});
