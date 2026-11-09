import { createServer } from 'node:http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createShutdown } from '../src/shutdown.js';

describe('DBR-004: NFR-019 database cleanup after HTTP drain', () => {
  let originalExitCode: typeof process.exitCode;
  beforeEach(() => { originalExitCode = process.exitCode; process.exitCode = undefined; vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); process.exitCode = originalExitCode; });

  function fixture(close = vi.fn(async () => {})) {
    const server = createServer();
    let drained: ((error?: Error) => void) | undefined;
    vi.spyOn(server, 'close').mockImplementation(callback => { drained = callback; return server; });
    const forceExit = vi.fn();
    const stop = createShutdown(server, 1000, { close, forceExit });
    return { stop, close, forceExit, drained: () => drained?.() };
  }

  it('disconnects exactly once after drain, then cancels the full shutdown deadline', async () => {
    const run = fixture(); run.stop(); run.stop();
    expect(run.close).not.toHaveBeenCalled();
    run.drained();
    await vi.advanceTimersByTimeAsync(1000);
    expect(run.close).toHaveBeenCalledTimes(1);
    expect(run.forceExit).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it('keeps the deadline active while database cleanup is stalled', async () => {
    const run = fixture(vi.fn(() => new Promise<void>(() => {})));
    run.stop(); run.drained();
    await vi.advanceTimersByTimeAsync(1000);
    expect(run.close).toHaveBeenCalledTimes(1);
    expect(run.forceExit).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });

  it.each([
    ['rejected promise', () => Promise.reject(new Error('synthetic cleanup detail'))],
    ['synchronous throw', () => { throw new Error('synthetic cleanup detail'); }],
    ['delayed rejection', () => new Promise<void>((_resolve, reject) => {
      setTimeout(() => reject(new Error('synthetic cleanup detail')), 500);
    })],
  ] as const)('retains the original deadline after %s without exposing the exception', async (_kind, close) => {
    const logs = (['error', 'warn', 'info', 'log'] as const).map(method =>
      vi.spyOn(console, method).mockImplementation(() => {}));
    const run = fixture(vi.fn(close));
    run.stop(); run.drained();
    await vi.advanceTimersByTimeAsync(999);
    expect(run.close).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
    expect(run.forceExit).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(run.forceExit).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
    run.stop();
    await vi.advanceTimersByTimeAsync(1000);
    expect(run.close).toHaveBeenCalledTimes(1);
    expect(run.forceExit).toHaveBeenCalledTimes(1);
    for (const log of logs) expect(log).not.toHaveBeenCalled();
  });
});
