import { Router } from 'express';

import { contactRoute } from '../api/services/Contact';
import { forumSectionRoute } from '../api/services/ForumSection';
import { themizationRoute } from '../api/services/Themization';
import { jsonBodyParserMiddleware, proxyMiddleware } from '../middlewares';

export const apiRoute = Router();

apiRoute
  .use('/forum/section', forumSectionRoute)
  .use('/themization', themizationRoute)
  .use('/contact', jsonBodyParserMiddleware(), contactRoute)
  /** Проксирует запросы к API на сервер Яндекса */
  .use('/', proxyMiddleware);
