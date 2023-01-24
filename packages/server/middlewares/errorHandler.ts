import type { ExpressError } from 'client/src/app.typings';
import type { NextFunction, Request, Response } from 'express';

import { isDev } from '../utils/isDev';

export const errorHandler = (err: ExpressError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    type: 'error',
    message: err.message,
    stack: isDev() ? err.stack : null,
  });
};
