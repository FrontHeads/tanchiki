import type { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const xssValidator = () => body('*').not().contains('</script>', { ignoreCase: true });

export const xssErrorHandler = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(Error('Запрещенный тег внутри строки'));
  }
};
