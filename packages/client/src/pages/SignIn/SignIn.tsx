import React, { type FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { useValidation } from '../../utils/validation';
import { signInFieldList, signInFormInitialState } from './data';
import { type SignInForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const validation = useValidation(signInFieldList);
  const pageTitle = 'Вход';

  const { error, isLoading } = useAppSelector(authSelectors.authState);

  const [formData, setFormData] = useState<SignInForm>(signInFormInitialState);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFormSubmitted(true);
  }, []);

  const onFormSubmitCallback = () => {
    dispatch(authThunks.signIn(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(authActions.setError(''));
    }
  }, [error]);

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <Form onSubmitHandler={onFormSubmit} header={pageTitle}>
        <FieldList<SignInForm>
          fieldList={signInFieldList}
          isFormSubmitted={isFormSubmitted}
          setIsFormSubmitted={setIsFormSubmitted}
          onFormSubmitCallback={onFormSubmitCallback}
          formData={formData}
          setFormData={setFormData}
          validation={validation}
          disabled={isLoading}
        />
        <div className="form__buttons-wrapper">
          <Button text="Войти" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
          <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} variant={ButtonVariant.Secondary} />
        </div>
      </Form>
    </>
  );
};
