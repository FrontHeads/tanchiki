import type { ExpressError } from 'client/src/app.typings';
import express, { type Request, type Response, Router } from 'express';

import { ForumTopic } from '../../models/ForumTopic';
import { isDev } from '../../utils/isDev';
import { throwIf } from '../../utils/throwIf';

export const forumTopicRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (_: Request, res: Response, next) => {
    ForumTopic.findAll()
      .then((topics: ForumTopic[]) => res.status(200).json(topics))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumTopic.findByPk(req.params.id)
      .then(throwIf(r => !r, res, 400, 'Топик не найден'))
      .then(topic => res.status(200).json(topic))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    ForumTopic.create(req.body)
      .then(() => res.status(201).send({ message: 'OK' }))
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    ForumTopic.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'OK' }))
      .catch(next);
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumTopic.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'OK' }))
      .catch(next);
  })
  .use((err: ExpressError, _req: Request, res: Response) => {
    const statusCode = err.status || 500;
    const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
    if (isDev()) {
      res.status(statusCode).send({ type: 'error', message, stack: err.stack });
    } else {
      res.status(statusCode).send({ type: 'error', message });
    }
  });
