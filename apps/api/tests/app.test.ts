import { readFileSync } from 'node:fs';
import { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('FND-001/002: FR-029/032, AT-029/032 foundation HTTP', () => {
  it('returns only safe liveness JSON matching the OpenAPI contract', async () => {
    const response = await request(createApp()).get('/health/live');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['x-powered-by']).toBeUndefined();

    const contract = JSON.parse(readFileSync(new URL('../../../docs/api/openapi.json', import.meta.url), 'utf8'));
    const schema = contract.paths['/health/live'].get.responses['200'].content['application/json'].schema;
    expect(schema).toEqual({
      type: 'object', required: ['status'], additionalProperties: false,
      properties: { status: { type: 'string', const: response.body.status } },
    });
  });

  it.each(['get', 'post'] as const)('returns safe JSON for an unknown %s route', async (method) => {
    const response = await request(createApp())[method]('/missing?token=fictional-private-input');
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toEqual({ error: {
      code: 'NOT_FOUND', message: 'Resource not found.', requestId: expect.stringMatching(uuid),
    } });
    expect(response.headers['x-request-id']).toBe(response.body.error.requestId);
    expect(response.text).not.toContain('fictional-private-input');
  });

  it('does not present an unimplemented readiness check as healthy', async () => {
    const response = await request(createApp()).get('/health/ready');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('generates separate server request IDs instead of trusting client input', async () => {
    const app = createApp();
    const first = await request(app).get('/health/live').set('X-Request-Id', 'untrusted-client-value');
    const second = await request(app).get('/health/live');
    expect(first.headers['x-request-id']).toMatch(uuid);
    expect(second.headers['x-request-id']).toMatch(uuid);
    expect(first.headers['x-request-id']).not.toBe(second.headers['x-request-id']);
  });

  it.each(['sync', 'async'] as const)('sanitizes an unexpected %s failure', async (kind) => {
    const routes = Router();
    const fail = () => { throw new Error('synthetic internal database detail'); };
    routes.get('/failure', kind === 'sync' ? fail : async () => fail());
    const response = await request(createApp(routes)).get('/failure');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: {
      code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.', requestId: expect.stringMatching(uuid),
    } });
    expect(response.headers['x-request-id']).toBe(response.body.error.requestId);
    expect(response.text).not.toContain('synthetic internal');
    expect(response.text).not.toContain('stack');
  });

  it('does not trust an unexpected exception status or expose its message', async () => {
    const routes = Router();
    routes.get('/failure', () => { throw Object.assign(new Error('synthetic private detail'), { status: 418 }); });
    const response = await request(createApp(routes)).get('/failure');
    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe('INTERNAL_ERROR');
    expect(response.text).not.toContain('synthetic private detail');
  });
});

describe('FND-003: NFR-025 bounded JSON parser', () => {
  it('returns sanitized 400 JSON for malformed input', async () => {
    const response = await request(createApp()).post('/missing')
      .set('Content-Type', 'application/json').send('{"fictional-private-input":');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: {
      code: 'INVALID_JSON', message: 'Invalid JSON body.', requestId: expect.stringMatching(uuid),
    } });
    expect(response.text).not.toContain('fictional-private-input');
  });

  it('rejects JSON larger than 64 KiB without returning the body', async () => {
    const response = await request(createApp()).post('/missing').send({ value: 'x'.repeat(65_536) });
    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
    expect(response.body.error.requestId).toMatch(uuid);
    expect(response.text).not.toContain('xxxxx');
  });

  it.each([
    ['Content-Encoding', 'gzip'],
    ['Content-Type', 'application/json; charset=iso-8859-1'],
  ])('rejects unsupported JSON encoding via %s', async (header, value) => {
    const response = await request(createApp()).post('/missing')
      .set('Content-Type', 'application/json').set(header!, value!).send('{}');
    expect(response.status).toBe(415);
    expect(response.body.error.code).toBe('UNSUPPORTED_ENCODING');
    expect(response.body.error.requestId).toMatch(uuid);
  });
});
