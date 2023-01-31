import express, { type Request, type Response, Router } from 'express';

import { ForumMessage } from '../../models/ForumMessage';
import { ForumTopic } from '../../models/ForumTopic';
import { User } from '../../models/User';
import { throwIf } from '../../utils/throwIf';

export const forumMessageRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/:id', (req: Request, res: Response, next) => {
    ForumMessage.findByPk(req.params.id, { include: [{ model: ForumTopic }, { model: User }], logging: true })
      .then(throwIf(r => !r, res, 400, 'Комментарий не найден'))
      .then(message => res.status(200).json(message))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    ForumMessage.create(req.body, { include: [{ model: User }], logging: true })
      .then(message => {
        ForumMessage.findByPk(message.id, { include: [{ model: ForumTopic }, { model: User }], logging: true })
          .then(message => res.status(200).json(message))
          .catch(next);
      })
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    ForumMessage.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Комментарий отредактирован' }))
      .catch(next);
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumMessage.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Комментарий удален' }))
      .catch(next);
  });
