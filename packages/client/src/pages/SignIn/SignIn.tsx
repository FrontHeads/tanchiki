import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { signInFieldList, signInFormInitialState } from './data';
import { SignInForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading } = useAppSelector(authSelectors.authState);
  const [formData, setFormData] = useState<SignInForm>(signInFormInitialState);

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(authThunks.signIn(formData));
    },
    [formData]
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(authActions.setError(''));
    }
  }, [error]);

  return (
    <Form handlerSubmit={submitHandler} header="Вход">
      <FieldList<SignInForm>
        fieldList={signInFieldList}
        setFormData={setFormData}
        formData={formData}
        disabled={isLoading}
      />
      <div className="form__buttons-wrapper">
        <Button text="Войти" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
