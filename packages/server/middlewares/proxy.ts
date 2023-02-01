import type { RequestHandler } from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

import { allowedHosts, YANDEX_API_HOST } from '../config/constants';
import { User } from '../models/User';

export const proxyMiddleware: RequestHandler = (req, res, next) => {
  // Если обращение к API идёт из незнакомого места - отклоняем
  if (!allowedHosts.includes(req.hostname)) {
    res.statusCode = 403;
    res.send('<!doctype html><p>Forbidden</p>');
    return;
  }

  return createProxyMiddleware({
    target: YANDEX_API_HOST,
    pathRewrite: { '^/api': '' }, // чтобы в конец пути target не добавлялось лишнее /api
    changeOrigin: true,
    cookieDomainRewrite: { 'ya-praktikum.tech': req.hostname },
    selfHandleResponse: true,
    logLevel: 'error',
    onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
      if (req.url.includes('/auth/user') && req.method === 'GET') {
        const response = responseBuffer.toString(); // convert buffer to string
        let user;
        try {
          user = JSON.parse(response);
        } catch (e) {
          user = null;
        }
        if (user && user.id) {
          try {
            await User.upsert({
              ya_id: user.id,
              login: user.login,
              display_name: user.display_name,
              avatar: user.avatar
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
      return responseBuffer;
    }),
  })(req, res, next);
};
