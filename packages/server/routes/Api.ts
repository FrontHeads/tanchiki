import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { allowedHosts } from '../';
import { forumSectionRoute } from '../api/services/ForumSection';

export const apiRoute = Router();

apiRoute
  .use('/forum/section', forumSectionRoute)
  .get('/test', (_, res) => {
    res.send('test');
  })
  .use('/', (req, res, next) => {
    // Если обращение к API идёт из незнакомого места - отклоняем
    if (!allowedHosts.includes(req.hostname)) {
      res.statusCode = 502;
      res.send('<!doctype html><p>Bad gateway</p>');
      return;
    }

    return createProxyMiddleware({
      target: 'https://ya-praktikum.tech/api/v2',
      pathRewrite: { '^/api': '' }, // чтобы в конец пути target не добавлялось лишнее /api
      changeOrigin: true,
      cookieDomainRewrite: { 'ya-praktikum.tech': req.hostname },
    })(req, res, next);
  });
