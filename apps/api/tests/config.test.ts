import { describe, expect, it } from 'vitest';
import { readConfig } from '../src/config.js';

describe('FND-004: NFR-017/019 environment configuration', () => {
  it('uses nonsecret loopback defaults without requiring database settings', () => {
    expect(readConfig({})).toEqual({ host: '127.0.0.1', port: 3000 });
  });

  it.each(['localhost', '127.0.0.1', '::1', '0.0.0.0'])('accepts an explicit host %s and port', (host) => {
    expect(readConfig({ HOST: host, PORT: '4321' })).toEqual({ host, port: 4321 });
  });

  it.each(['', '0', '-1', '65536', '3000x', '3.5', ' 3000 ', 'synthetic-private-value'])('rejects invalid PORT %j without exposing it', (port) => {
    expect(() => readConfig({ PORT: port })).toThrow('PORT must be an integer between 1 and 65535.');
  });

  it.each(['', 'bad host', 'http://localhost', 'host\nsynthetic-private-value'])('rejects invalid HOST %j without exposing it', (host) => {
    expect(() => readConfig({ HOST: host })).toThrow('HOST must be an IP address or hostname.');
  });

  it('ignores unrelated settings instead of exposing them in configuration', () => {
    expect(readConfig({ DATABASE_URL: 'synthetic-not-a-connection', PASSWORD: 'synthetic-not-a-secret' }))
      .toEqual({ host: '127.0.0.1', port: 3000 });
  });
});
