import { FC, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { SignUpForm } from './typings';

export const SignUp: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);
  if (isAuthenticated) {
    navigate(Paths.Home);
  }

  const formData: SignUpForm = {
    login: '',
    password: '',
    password_check: '',
    first_name: '',
    second_name: '',
    email: '',
    phone: '',
  };
  const [requestBody, setRequestBody] = useState<SignUpForm>(formData);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRequestBody({ ...requestBody, [name]: value });
  };

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(authThunks.signUp(requestBody));
    },
    [requestBody]
  );

  return (
    <Form handlerSubmit={submitHandler} header="Регистрация">
      <FormField
        title="Email"
        type="email"
        id="email"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="ivanIvanov@yandex.ru"
        required={true}
      />
      <FormField
        title="Логин"
        type="text"
        id="login"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="ivanIvanov"
        required={true}
      />
      <FormField
        title="Имя"
        type="text"
        id="first_name"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="Иван"
        required={false}
      />
      <FormField
        title="Фамилия"
        type="text"
        id="second_name"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="Иванов"
        required={false}
      />
      <FormField
        title="Телефон"
        type="tel"
        id="phone"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="+7 800 555 35 35"
        required={false}
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
      <FormField
        title="Повторите пароль"
        type="password"
        id="password_check"
        onChange={inputChangeHandler}
        disabled={isLoading}
        placeholder="Латинские буквы и цифры"
        required={true}
      />
      <div className="form__buttons-wrapper">
        {error && `Error: ${error}`}
        <Button text="Зарегистрироваться" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Вход" onClick={() => navigate(Paths.SignIn)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
