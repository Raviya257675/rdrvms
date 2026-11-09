export type ReadinessCheck = () => Promise<boolean>;

export function createReadinessCheck(query: () => Promise<unknown>, timeoutMs = 1500): ReadinessCheck {
  let pending: Promise<boolean> | undefined;

  return async () => {
    // Keep a stalled underlying query shared even after an HTTP caller times out.
    // Driver acquisition/query timeouts separately bound its resource lifetime.
    pending ??= Promise.resolve().then(query).then(
      () => { pending = undefined; return true; },
      () => { pending = undefined; return false; },
    );
    let deadline: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        pending,
        new Promise<boolean>(resolve => { deadline = setTimeout(() => resolve(false), timeoutMs); }),
      ]);
    } finally {
      clearTimeout(deadline);
    }
  };
}
