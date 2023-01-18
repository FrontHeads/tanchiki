import { type Request, type Response, Router } from 'express';

import { ForumSection } from '../../models/ForumSection';

export const forumSectionRoute = Router()
  .get('', async (_: Request, res: Response): Promise<Response> => {
    const allDogs: ForumSection[] = await ForumSection.findAll();
    return res.status(200).json(allDogs);
  })
  .get(':id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const model: ForumSection | null = await ForumSection.findByPk(id);
    return res.status(200).json(model);
  })
  .post('', async (req: Request, res: Response): Promise<Response> => {
    const model: ForumSection = await ForumSection.create({ ...req.body });
    return res.status(201).json(model);
  })
  .put(':id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await ForumSection.update({ ...req.body }, { where: { id } });
    const updatedModel: ForumSection | null = await ForumSection.findByPk(id);
    return res.status(200).json(updatedModel);
  })
  .delete(':id', async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const deletedModel: ForumSection | null = await ForumSection.findByPk(id);
    await ForumSection.destroy({ where: { id } });
    return res.status(200).json(deletedModel);
  });
