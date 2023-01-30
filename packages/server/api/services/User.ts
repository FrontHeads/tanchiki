import express, { type Request, type Response, Router } from 'express';

import { User } from '../../models/User';

export const userRoute = Router()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .post('/', (req: Request, res: Response, next) => {
    User.findOrCreate(req.body)
      .then(() => res.status(201).send({ message: 'Пользователь добавлен' }))
      .catch(next);
  })
  .put('/:id', (req: Request, res: Response, next) => {
    User.update(req.body, { where: { id: req.params.id } })
      .then(() => res.status(201).send({ message: 'Пользователь обновлен' }))
      .catch(next);
  });
