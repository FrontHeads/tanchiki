import { Router } from 'express';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

import { allowedHosts } from '../';
import { forumMessageRoute } from '../api/services/ForumMessage';
import { forumSectionRoute } from '../api/services/ForumSection';
import { forumTopicRoute } from '../api/services/ForumTopic';
import { errorHandler } from '../middlewares/errorHandler';
import { User } from '../models/User';

export const apiRoute = Router();

apiRoute
  .use('/forum/section', forumSectionRoute)
  .use('/forum/topic', forumTopicRoute)
  .use('/forum/message', forumMessageRoute)
  .use(errorHandler)

  .get('/test', (_, res) => {
    res.send('test');
  })
  .use('/', (req, res, next) => {
    // Если обращение к API идёт из незнакомого места - отклоняем
    if (!allowedHosts.includes(req.hostname)) {
      res.statusCode = 403;
      res.send('<!doctype html><p>Forbidden</p>');
      return;
    }

    return createProxyMiddleware({
      target: 'https://ya-praktikum.tech/api/v2',
      pathRewrite: { '^/api': '' }, // чтобы в конец пути target не добавлялось лишнее /api
      changeOrigin: true,
      cookieDomainRewrite: { 'ya-praktikum.tech': req.hostname },
      selfHandleResponse: true,
      logLevel: 'error',
      onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, _req, _res) => {
        if (req.url.includes('/auth/user')) {
          const response = responseBuffer.toString(); // convert buffer to string
          let user = null;
          try {
            user = JSON.parse(response);
          } catch (e) {
            user = null;
          }
          if (user && user.id) {
            try {
              await User.upsert({
                user_id: user.id,
                login: user.login,
                display_name: user.display_name,
              });
            } catch (e) {
              console.error(e);
            }
          }
        }
        return responseBuffer;
      }),
    })(req, res, next);
  });
