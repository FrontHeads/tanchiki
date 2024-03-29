import React, { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, oauthThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { signInFieldList, signInFormInitialState } from './data';
import { type SignInForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pageTitle = 'Вход';

  const { error, isLoading } = useAppSelector(authSelectors.authState);

  const [formData, setFormData] = useState<SignInForm>(signInFormInitialState);

  const onFormSubmitCallback = () => {
    dispatch(authThunks.signIn(formData));
  };

  const oAuthHandler = () => {
    dispatch(oauthThunks.getOAuthCode());
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
      <Form header={pageTitle}>
        <FieldList<SignInForm>
          fieldList={signInFieldList}
          onFormSubmitCallback={onFormSubmitCallback}
          formData={formData}
          setFormData={setFormData}
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
    </>
  );
};
