import express, { type Request, type Response, Router } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { ForumSection } from '../../models/ForumSection';
import { ForumTopic } from '../../models/ForumTopic';
import { throwIf } from '../../utils/throwIf';

export const forumSectionRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/', (_: Request, res: Response, next) => {
    ForumSection.findAll({
      subQuery: false,
      attributes: { include: [[Sequelize.fn('COUNT', Sequelize.col('topics.id')), 'topicCount']] },
      include: { model: ForumTopic, attributes: [] },
      group: ['ForumSection.id'],
    })
      .then((sections: ForumSection[]) => res.status(200).json(sections))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumSection.findByPk(req.params.id, {include: ForumTopic})
      .then(throwIf(r => !r, res, 400, 'Категория не найдена'))
      .then(section => res.status(200).json(section))
      .catch(next);
  })
  .post('/', (req: Request, res: Response, next) => {
    ForumSection.create(req.body)
      .then(() => res.status(201).send({ message: 'Категория создана' }))
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    ForumSection.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Категория отредактирована' }))
      .catch(next);
  })
  .delete('/:id', (req: Request, res: Response, next) => {
    ForumSection.destroy({ where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Категория удалена' }))
      .catch(next);
  });
