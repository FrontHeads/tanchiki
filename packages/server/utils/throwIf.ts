import type { Response } from 'express';

/**
 * Делаем кастомную проверку данных и возвращаем ошибку
 * @param fn - Функция проверки, если возвращает true, то trowIf выбрасывает ошибку
 * @param responseObject
 * @param errorStatus
 * @param errorMessage
 */
export const throwIf =
  (fn: (result: unknown) => unknown, responseObject: Response, errorStatus: number, errorMessage: string) =>
  (result: unknown) => {
    if (fn(result)) {
      responseObject.status(errorStatus || 500).json({
        type: 'error',
        message: errorMessage,
      });
    }
    return result;
  };
