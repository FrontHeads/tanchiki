import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, oauthThunks, useAppDispatch, useAppSelector } from '../../store';
import { useValidation } from '../../utils/validation';
import { signInFieldList, signInFormInitialState } from './data';
import { SignInForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const validation = useValidation(signInFieldList);

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

  const oAuthHandler = () => {
    dispatch(oauthThunks.getServiceId());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(authActions.setError(''));
    }
  }, [error]);

  return (
    <Form onSubmitHandler={onFormSubmit} header="Вход">
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
        <div className="form__oauth">
          <div>или войти с помощью</div>
          <Button text="Яндекс ID" onClick={oAuthHandler} variant={ButtonVariant.Secondary} />
        </div>
      </div>
    </Form>
  );
};
