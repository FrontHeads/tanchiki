import { Router } from 'express';

import { contactRoute } from '../api/services/Contact';
import { forumSectionRoute } from '../api/services/ForumSection';
import { proxyMiddleware } from '../middlewares/proxy';

export const apiRoute = Router();

apiRoute
  .use('/forum/section', forumSectionRoute)
  .use('/contact', contactRoute)
  /** Проксирует запросы к API на сервер Яндекса */
  .use('/', proxyMiddleware);
