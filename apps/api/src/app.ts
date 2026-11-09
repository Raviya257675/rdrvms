import { randomUUID } from 'node:crypto';
import express, { type Express, type Router } from 'express';
import { errorHandler } from './http/errors.js';

// The optional router composes internal routes; the production server passes none.
export function createApp(routes?: Router): Express {
  const app = express();
  app.disable('x-powered-by');

  app.use((_request, response, next) => {
    response.locals.requestId = randomUUID();
    response.setHeader('X-Request-Id', response.locals.requestId);
    next();
  });
  app.use(express.json({ limit: 65_536, inflate: false }));

  app.get('/health/live', (_request, response) => {
    response.json({ status: 'ok' });
  });

  if (routes) app.use(routes);

  app.use((_request, response) => {
    response.status(404).json({ error: {
      code: 'NOT_FOUND',
      message: 'Resource not found.',
      requestId: response.locals.requestId,
    } });
  });
  app.use(errorHandler);
  return app;
}
