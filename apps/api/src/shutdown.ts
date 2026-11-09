import type { Server } from 'node:http';

export function createShutdown(
  server: Pick<Server, 'close' | 'closeAllConnections'>,
  timeoutMs = 10_000,
): () => void {
  let stopping = false;

  return () => {
    if (stopping) return;
    stopping = true;

    const deadline = setTimeout(() => {
      process.exitCode = 1;
      server.closeAllConnections();
    }, timeoutMs);
    deadline.unref();

    server.close((error) => {
      clearTimeout(deadline);
      if (error) process.exitCode = 1;
    });
  };
}
