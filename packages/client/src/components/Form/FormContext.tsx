import { createContext, useContext } from 'react';

import { type FormContextInitial } from './typings';

export const FormContext = createContext<FormContextInitial | null>(null);

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (context === null) {
    throw new Error('Form context is empty');
  }
  return context;
};
