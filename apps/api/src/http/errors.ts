import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  // A committed response cannot be replaced with JSON. Close it without passing
  // the exception to Express's default handler, which could print internal data.
  if (response.headersSent) {
    response.destroy();
    return;
  }

  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred.';

  // Only known parser failures receive client-error statuses. Never serialize
  // arbitrary exceptions, messages, status fields or parser input bodies.
  if (typeof error === 'object' && error !== null && 'type' in error) {
    switch (error.type) {
      case 'entity.parse.failed':
        status = 400;
        code = 'INVALID_JSON';
        message = 'Invalid JSON body.';
        break;
      case 'entity.too.large':
        status = 413;
        code = 'PAYLOAD_TOO_LARGE';
        message = 'JSON body exceeds the 64 KiB limit.';
        break;
      case 'encoding.unsupported':
      case 'charset.unsupported':
        status = 415;
        code = 'UNSUPPORTED_ENCODING';
        message = 'Unsupported JSON encoding.';
        break;
    }
  }

  response.status(status).json({ error: {
    code, message, requestId: response.locals.requestId,
  } });
};
