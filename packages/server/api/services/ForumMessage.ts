import express, { type Request, type Response, Router } from 'express';

import { checkAuthMiddleware } from '../../middlewares';
import { ForumMessage } from '../../models/ForumMessage';
import { ForumTopic } from '../../models/ForumTopic';
import { User } from '../../models/User';
import { throwIf } from '../../utils/throwIf';

export const forumMessageRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', checkAuthMiddleware)
  .get('/:id', (req: Request, res: Response, next) => {
    ForumMessage.findByPk(req.params.id, { include: [{ model: ForumTopic }, { model: User }] })
      .then(throwIf(r => !r, res, 400, 'Комментарий не найден'))
      .then(message => res.status(200).json(message))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    if (res.locals.user && res.locals.user.id === req.body.user_id) {
      ForumMessage.create(req.body, { include: [{ model: User }] })
        .then(message => {
          ForumMessage.findByPk(message.id, { include: [{ model: ForumTopic }, { model: User }] })
            .then(message => res.status(200).json(message))
            .catch(next);
        })
        .catch(next);
    } else {
      res.status(500).send({ type: 'error', message: 'Доступ запрещен' });
    }
  })
  .put('/:id', (req: Request, res: Response, next) => {
    if (res.locals.user && res.locals.user.id === req.body.user_id) {
      ForumMessage.update(req.body, { where: { id: req.params.id }, returning: true })
        .then(result => {
          const [, message] = result;
          ForumMessage.findByPk(message[0].id, { include: [{ model: ForumTopic }, { model: User }] })
            .then(message => res.status(200).json(message))
            .catch(next);
        })
        .catch(next);
    } else {
      res.status(500).send({ type: 'error', message: 'Доступ запрещен' });
    }
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumMessage.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Комментарий удален' }))
      .catch(next);
  });
