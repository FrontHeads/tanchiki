import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { signInInputFields } from './data';
import { LoginForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);
  const formData: LoginForm = { login: '', password: '' };
  const [requestBody, setRequestBody] = useState<LoginForm>(formData);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('С возвращением!');
      navigate(Paths.Home);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(authActions.setError(''));
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setRequestBody({ ...requestBody, [name]: value });
    },
    [requestBody]
  );

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(authThunks.signIn(requestBody));
    },
    [requestBody]
  );

  return (
    <Form handlerSubmit={submitHandler} header="Вход">
      <>
        {signInInputFields.map(field => (
          <FormField key={field.id} {...field} onChange={inputChangeHandler} disabled={isLoading} />
        ))}
      </>

      <div className="form__buttons-wrapper">
        <Button text="Войти" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
