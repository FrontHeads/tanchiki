import { model, Schema } from 'mongoose';

type ContactModel = {
  name?: string;
  email: string;
  message: string;
};

const contactSchema = new Schema<ContactModel>(
  {
    name: String,
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    strict: true,
  }
);

export const Contact = model<ContactModel>('contact', contactSchema);
