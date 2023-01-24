import express, { type Request, type Response, Router } from 'express';

import { ForumSection } from '../../models/ForumSection';
import { ForumTopic } from '../../models/ForumTopic';
import { throwIf } from '../../utils/throwIf';

export const forumTopicRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (req: Request, res: Response, next) => {
    ForumTopic.findAll({ where: { section_id: req.query.section_id } })
      .then((topics: ForumTopic[]) => res.status(200).json(topics))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumTopic.findByPk(req.params.id, { include: ForumSection })
      .then(throwIf(r => !r, res, 400, 'Тема не найдена'))
      .then(topic => res.status(200).json(topic))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    ForumTopic.create(req.body)
      .then(() => res.status(201).send({ message: 'Тема создана' }))
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    ForumTopic.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Тема отредактирована' }))
      .catch(next);
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumTopic.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Тема удалена' }))
      .catch(next);
  });
