export interface DatabaseConfig {
  connectionString: string;
}

export function readDatabaseConfig(environment: Readonly<NodeJS.ProcessEnv>): DatabaseConfig {
  try {
    let connectionString = environment.DATABASE_URL;
    if (connectionString === undefined) {
      const user = environment.POSTGRES_USER;
      const password = environment.POSTGRES_PASSWORD;
      const database = environment.POSTGRES_DB;
      const host = environment.POSTGRES_HOST ?? '127.0.0.1';
      const port = environment.POSTGRES_PORT ?? '5432';
      if (!user || !password || !database || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error();
      const url = new URL(`postgresql://${host.includes(':') ? `[${host}]` : host}:${port}`);
      url.username = encodeURIComponent(user);
      url.password = encodeURIComponent(password);
      url.pathname = `/${encodeURIComponent(database)}`;
      connectionString = url.toString();
    }
    const parsed = new URL(connectionString);
    if (!['postgresql:', 'postgres:'].includes(parsed.protocol) || !parsed.hostname || parsed.pathname.length <= 1) throw new Error();
    // pg lets URL parameters override client defaults. Keep this milestone's
    // fixed timeout guarantees, including indirect overrides through options.
    if (['statement_timeout', 'query_timeout', 'connectionTimeoutMillis', 'options']
      .some(key => parsed.searchParams.has(key))) throw new Error();
    return { connectionString };
  } catch {
    // Never expose the URL, credentials or the URL parser's input-bearing error.
    throw new Error('Database configuration is invalid.');
  }
}
