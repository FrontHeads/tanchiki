import express, { type Request, type Response, Router } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { checkAuthMiddleware } from '../../middlewares';
import { ForumMessage } from '../../models/ForumMessage';
import { ForumSection } from '../../models/ForumSection';
import { ForumTopic } from '../../models/ForumTopic';
import { User } from '../../models/User';
import { throwIf } from '../../utils/throwIf';

export const forumTopicRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/', checkAuthMiddleware)
  .get('/', (req: Request, res: Response, next) => {
    ForumTopic.findAll({ where: { section_id: req.query.section_id }})
      .then((topics: ForumTopic[]) => res.status(200).json(topics))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumTopic.findByPk(req.params.id, {
      include: [
        { model: ForumSection },
        { model: ForumMessage,
          include: [{ model: User }],
        },
        { model: User }],
      order: [
        [ Sequelize.col('messages.created_at'), 'ASC' ]
      ]
    })
      .then(throwIf(r => !r, res, 400, 'Тема не найдена'))
      .then(topic => res.status(200).json(topic))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    if (res.locals.user && res.locals.user.id === req.body.user_id) {
    ForumTopic.create(req.body)
      .then(topic => res.status(201).send({ id: topic.id }))
     .catch(next);
    } else {
      res.status(500).send({ type: 'error', message: 'Доступ запрещен' });
    }
  })
  .put('/:id', (req: Request, res: Response, next) => {
    if (res.locals.user && res.locals.user.id === req.body.user_id) {
    ForumTopic.update(req.body, { where: { id: req.params.id }, returning: true })
      .then(result => {
        const [, messages] = result;
        res.status(200).json(messages[0]);
      })
      .catch(next);
    } else {
      res.status(500).send({ type: 'error', message: 'Доступ запрещен' });
    }
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumTopic.destroy({ where: { id: req.params.id } })
      .then(topic => res.status(201).json(topic))
      .catch(next);
  });