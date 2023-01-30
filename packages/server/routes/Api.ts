import { Router } from 'express';

import { contactRoute } from '../api/services/Contact';
import { forumMessageRoute } from '../api/services/ForumMessage';
import { forumSectionRoute } from '../api/services/ForumSection';
import { forumTopicRoute } from '../api/services/ForumTopic';
import { themizationRoute } from '../api/services/Themization';
import { jsonBodyParserMiddleware, proxyMiddleware } from '../middlewares';
import { errorHandler } from '../middlewares/errorHandler';

export const apiRoute = Router();

apiRoute
  .use('/forum/section', forumSectionRoute)
  .use('/forum/topic', forumTopicRoute)
  .use('/forum/message', forumMessageRoute)
  .use(errorHandler)
  .use('/themization', themizationRoute)
  .use('/contact', jsonBodyParserMiddleware(), contactRoute)
  /** Проксирует запросы к API на сервер Яндекса */
  .use('/', proxyMiddleware);
