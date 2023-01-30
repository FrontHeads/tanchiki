import type { RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { allowedHosts, YANDEX_API_HOST } from '../config/constants';

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
  })(req, res, next);
};
