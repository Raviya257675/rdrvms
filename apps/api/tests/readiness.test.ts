import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

describe('DBR-001: FR-029 / AT-029 database readiness', () => {
  it('reports readiness after an actual injected check succeeds', async () => {
    const response = await request(createApp(undefined, async () => true)).get('/health/ready');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ready' });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
    const contract = JSON.parse(readFileSync(new URL('../../../docs/api/openapi.json', import.meta.url), 'utf8'));
    const responses = contract.paths['/health/ready'].get.responses;
    expect(responses['200'].content['application/json'].schema).toEqual({
      type: 'object', required: ['status'], additionalProperties: false,
      properties: { status: { type: 'string', const: 'ready' } },
    });
    expect(responses['503'].content['application/json'].schema).toEqual({ $ref: '#/components/schemas/Error' });
  });

  it.each(['false', 'reject', 'missing'])('fails closed for a %s check with no internal details', async (mode) => {
    const check = mode === 'missing' ? undefined : async () => {
      if (mode === 'reject') throw new Error('synthetic internal connection detail');
      return false;
    };
    const app = createApp(undefined, check);
    const response = await request(app).get('/health/ready');
    expect(response.status).toBe(503);
    expect(response.body).toEqual({ error: {
      code: 'NOT_READY', message: 'Service is not ready.', requestId: expect.any(String),
    } });
    expect(response.headers['x-request-id']).toBe(response.body.error.requestId);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.text).not.toContain('synthetic internal');
    const live = await request(app).get('/health/live');
    expect(live.status).toBe(200);
    expect(live.body).toEqual({ status: 'ok' });
  });

  it('recovers on a subsequent request rather than caching the failed state', async () => {
    let ready = false;
    const app = createApp(undefined, async () => ready);
    expect((await request(app).get('/health/ready')).status).toBe(503);
    ready = true;
    expect((await request(app).get('/health/ready')).status).toBe(200);
  });
});
import { readFileSync } from 'node:fs';
