import type { Server } from 'node:http';

export function createShutdown(
  server: Pick<Server, 'close' | 'closeAllConnections'>,
  timeoutMs = 10_000,
  resources?: { close: () => Promise<void>; forceExit: () => void },
): () => void {
  let stopping = false;

  return () => {
    if (stopping) return;
    stopping = true;

    const deadline = setTimeout(() => {
      process.exitCode = 1;
      server.closeAllConnections();
      resources?.forceExit();
    }, timeoutMs);
    deadline.unref();

    server.close((error) => {
      if (error) process.exitCode = 1;
      if (!resources) {
        clearTimeout(deadline);
        return;
      }
      Promise.resolve().then(resources.close).then(
        () => clearTimeout(deadline),
        // Failed cleanup may leave live handles; retain the original deadline.
        () => { process.exitCode = 1; },
      );
    });
  };
}
