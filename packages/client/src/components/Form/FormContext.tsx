import { type Dispatch, createContext, useContext } from 'react';

type FormContextInitial = {
  isFormSubmitted: boolean;
  setIsFormSubmitted: Dispatch<boolean>;
};

export const FormContext = createContext<FormContextInitial | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);

  // Проверяем, что context не пустой
  if (!context) {
    throw new Error('Form context is empty');
  }
  return context;
};
