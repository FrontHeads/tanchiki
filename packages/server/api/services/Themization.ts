import express, { type Request, type Response, Router } from 'express';

import { Themes } from '../../models/Themes';
import { UserThemes } from '../../models/UserThemes';

export const themizationRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .get('/:userId', async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.params;

    const userTheme: UserThemes | null = await UserThemes.findOne({
      where: { user_id: userId },
      include: [{ model: Themes, attributes: ['theme_name'] }],
    });

    if (userTheme && userTheme.theme.theme_name) {
      return res.status(200).json(userTheme.theme.theme_name);
    }

    return res.status(404).json('user theme not found');
  })
  .post('/', async (req: Request, res: Response): Promise<Response> => {
    const { themeName, userId } = req.body;

    const theme: Themes | null = await Themes.findOne({ where: { theme_name: themeName } });

    if (theme) {
      const userTheme: [UserThemes, null | boolean] = await UserThemes.upsert({ theme_id: theme.id, user_id: userId });

      if (userTheme) {
        return res.status(201).json(userTheme);
      }
    }

    return res.status(500).json('invalid data or DB error');
  });
