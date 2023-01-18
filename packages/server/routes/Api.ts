import { Router } from 'express';

import { forumSectionRoute } from '../api/services/ForumSection';

export const apiRoute = Router();
export const forumRoute = Router();

apiRoute
  .use('/forum', forumRoute.use('/section', forumSectionRoute))
  .get('/test', (_, res) => {
    res.send('test');
  })
  .get('/', (_, res) => {
    res.json('👋 Howdy from the server :)');
  });
