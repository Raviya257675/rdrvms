import { afterEach, describe, expect, it, vi } from 'vitest';
import { createReadinessCheck } from '../src/health.js';

describe('DBR-002: FR-029 / NFR-025 bounded database probe', () => {
  afterEach(() => vi.useRealTimers());

  it('returns true only when the query succeeds and handles sync/async failures', async () => {
    expect(await createReadinessCheck(async () => undefined)()).toBe(true);
    expect(await createReadinessCheck(async () => { throw new Error('synthetic query failure'); })()).toBe(false);
    expect(await createReadinessCheck(() => { throw new Error('synthetic sync failure'); })()).toBe(false);
  });

  it('bounds a stalled query and coalesces it across repeated HTTP checks', async () => {
    vi.useFakeTimers();
    const query = vi.fn(() => new Promise<void>(() => {}));
    const check = createReadinessCheck(query, 50);
    const first = check();
    const concurrent = check();
    await vi.advanceTimersByTimeAsync(50);
    expect(await first).toBe(false);
    expect(await concurrent).toBe(false);
    const next = check();
    await vi.advanceTimersByTimeAsync(50);
    expect(await next).toBe(false);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('retries and recovers after a failed underlying query settles', async () => {
    const query = vi.fn().mockRejectedValueOnce(new Error('synthetic outage')).mockResolvedValue(undefined);
    const check = createReadinessCheck(query);
    expect(await check()).toBe(false);
    expect(await check()).toBe(true);
    expect(query).toHaveBeenCalledTimes(2);
  });
});
