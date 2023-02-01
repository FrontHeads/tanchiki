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
            Sequelize.literal(`(SELECT COUNT(*)
            from forum_topics as t
            where t.section_id="ForumSection"."id")`),
            'topicCount',
          ],
          [
            Sequelize.literal(` (SELECT COUNT(M.*)
              FROM FORUM_TOPICS AS T
              LEFT JOIN FORUM_MESSAGES AS M ON M.TOPIC_ID=T.ID
              WHERE T.SECTION_ID = "ForumSection"."id")`),
            'messages',
          ],
        ],
      },
    })
      .then((sections: ForumSection[]) => res.status(200).json(sections))
      .catch(next);
  })
  .get('/:id', (req: Request, res: Response, next) => {
    ForumSection.findByPk(req.params.id,  {
      include: [
        {
          model: ForumTopic,
          attributes: {
            include: [
              [
                Sequelize.literal(`(SELECT COUNT(*)
                  FROM FORUM_MESSAGES AS M
                  WHERE M.TOPIC_ID = "topics"."id")`),
                'messages',
              ],
            ],
          },
        },
      ],
    })
      .then(throwIf(r => !r, res, 400, 'Категория не найдена'))
      .then(section => res.status(200).json(section))
      .catch(next);
  });
