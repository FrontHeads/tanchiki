import { type Request, type Response, Router } from 'express';
import { Error } from 'mongoose';

import { Contact } from '../../mongoModels/Contact';

export const contactRoute = Router().post('/send', async (req: Request, response: Response): Promise<Response> => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    return response.status(200);
  } catch (error) {
    response.status(400);
    if (error instanceof Error.ValidationError) {
      return response.json({ reason: error.message, details: error.errors });
    }

    return response.json({ reason: 'Error' });
  }
});
