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
      attributes: {
        include: [
          [
            Sequelize.literal(`
              (SELECT Count(*) :: INTEGER
               FROM   forum_topics AS t
               WHERE  t.section_id = "ForumSection"."id")
            `),
            'topicCount',
          ],
          [
            Sequelize.literal(`
              (SELECT Count(M.*) :: INTEGER
               FROM   forum_topics AS T
                      left join forum_messages AS M
                             ON M.topic_id = T.id
               WHERE  T.section_id = "ForumSection"."id")
               `),
            'messages',
          ],
        ],
      },
    })
      .then((sections: ForumSection[]) => {
        res.status(200).json(sections);
      })
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumSection.findByPk(req.params.id, {
      include: [
        {
          model: ForumTopic,
          attributes: {
            include: [
              [
                Sequelize.literal(`
                  (SELECT Count(*) :: INTEGER
                   FROM   forum_messages AS M
                   WHERE  M.topic_id = "topics"."id")
                  `),
                'messages',
              ],
            ],
          },
        },
      ],
      order: [[Sequelize.col('topics.created_at'), 'ASC']],
    })
      .then(throwIf(r => !r, res, 400, 'Категория не найдена'))
      .then(section => res.status(200).json(section))
      .catch(next);
  });
