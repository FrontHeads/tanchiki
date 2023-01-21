import { type NextFunction, type Request, type Response, Router } from 'express';

import { ForumTopic } from '../../models/ForumTopic';

const throwIf =
  (fn: (result: any) => any, res: Response, errorStatus?: number, errorMessage?: string) => (result: any) => {
    if (fn(result)) {
      res.status(errorStatus || 500).json({
        type: 'error',
        message: errorMessage || 'Что-то пошло не так',
      });
    }
    return result;
  };

export const forumTopicRoute = Router()
  .get('/', (_: Request, res: Response, next) => {
    ForumTopic.findAll()
      .then((topics: ForumTopic[]) => res.status(200).json(topics))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumTopic.findByPk(req.params.id)
      .then(throwIf(r => !r, res, 400, 'Topic not found'))
      .then(topic => res.status(200).json(topic))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    ForumTopic.create(req.body)
      .then(() => res.status(201).send({ message: 'Топик создан!' }))
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    ForumTopic.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Топик обновлен!' }))
      .catch(next);
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumTopic.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Топик удален!' }))
      .catch(next);
  })
  .use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
    res.status(statusCode).send({ type: 'error', message });
  });
