import { createServer } from 'node:http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createShutdown } from '../src/shutdown.js';

describe('FND-005: NFR-019 bounded HTTP shutdown', () => {
  let originalExitCode: typeof process.exitCode;

  beforeEach(() => {
    originalExitCode = process.exitCode;
    process.exitCode = undefined;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    process.exitCode = originalExitCode;
  });

  function fixture() {
    const server = createServer();
    let closed: ((error?: Error) => void) | undefined;
    const close = vi.spyOn(server, 'close').mockImplementation((callback) => {
      closed = callback;
      return server;
    });
    const forceClose = vi.spyOn(server, 'closeAllConnections');
    const stop = createShutdown(server, 1000);
    return { close, forceClose, stop, complete: (error?: Error) => closed?.(error) };
  }

  it('stops accepting connections once and allows in-flight work to finish', () => {
    const lifecycle = fixture();
    lifecycle.stop();
    lifecycle.stop();
    expect(lifecycle.close).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(999);
    expect(lifecycle.forceClose).not.toHaveBeenCalled();
    lifecycle.complete();
    vi.advanceTimersByTime(1000);
    expect(lifecycle.forceClose).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it('force-closes HTTP connections at the deadline and preserves failure status', () => {
    const lifecycle = fixture();
    lifecycle.stop();
    vi.advanceTimersByTime(1000);
    expect(lifecycle.forceClose).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
    lifecycle.complete();
    expect(process.exitCode).toBe(1);
  });

  it('sets failure status when closing fails', () => {
    const lifecycle = fixture();
    lifecycle.stop();
    lifecycle.complete(new Error('synthetic internal close failure'));
    expect(process.exitCode).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(lifecycle.forceClose).not.toHaveBeenCalled();
  });
});
