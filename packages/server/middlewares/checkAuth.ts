import type { RequestHandler } from 'express';

import { YANDEX_API_HOST } from '../config/constants';

/** Проверяет авторизован ли юзер. Если нет - дальнейшие запросы не проходят.
 * Этим middleware удобно закрывать ручки, которые должны быть доступны только авторизованным пользователям.
 */
export const checkAuthMiddleware: RequestHandler = async (req, res, next) => {
  if (req.headers.cookie) {
    const isAuth = await fetch(`${YANDEX_API_HOST}/auth/user`, {
      headers: {
        Cookie: req.headers.cookie,
      },
    });

    if (isAuth.ok) {
      // Передаем данные авторизованного юзера в следующий middleware
      res.locals.user = await isAuth.json();
      return next();
    }
  }

  return res.status(401).json('not authorized');
};
