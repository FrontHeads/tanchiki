import { createAsyncThunk } from '@reduxjs/toolkit';

import { contactAPI } from './../../../api/contactAPI';
import { type ContactFormData } from './typings';

export const send = createAsyncThunk('contact/send', async (contactFormData: ContactFormData) => {
  await contactAPI.send(contactFormData);
});

export const contactThunks = { send };
