import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { LoginForm } from './typings';

export const SignIn: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);
  if (isAuthenticated) {
    navigate(Paths.Home);
  }

  const formData: LoginForm = { login: '', password: '' };
  const [requestBody, setRequestBody] = useState<LoginForm>(formData);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRequestBody({ ...requestBody, [name]: value });
  };

  const submitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await dispatch(authThunks.signIn(requestBody));
    },
    [requestBody]
  );

  return (
    <Form handlerSubmit={submitHandler} header="Вход">
      <FormField
        title="Логин"
        type="text"
        id="login"
        onChange={inputChangeHandler}
        placeholder="ivanIvanov"
        disabled={isLoading}
        required={true}
      />

      <FormField
        title="Пароль"
        type="password"
        id="password"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="Латинские буквы и цифры"
        required={true}
      />

      <div className="form__buttons-wrapper">
        {error && `Error: ${error}`}
        <Button text="Войти" type="submit" selector="button_primary" disabled={isLoading} />
        <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} selector="button_secondary" />
      </div>
    </Form>
  );
};
