import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { SignUpForm } from './typings';

export const SignUp: FC = () => {
  const navigate = useNavigate();
  const formData: SignUpForm = {
    email: '',
    login: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_check: '',
  };
  const [responseBody, setResponseBody] = useState<SignUpForm>(formData);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(responseBody);
  };

  return (
    <Form handlerSubmit={submitHandler} header="Регистрация">
      <FormField
        title="Email"
        type="email"
        id="email"
        onChange={inputChangeHandler}
        placeholder="ivanIvanov@yandex.ru"
        required={true}
      />
      <FormField
        title="Логин"
        type="text"
        id="login"
        onChange={inputChangeHandler}
        placeholder="ivanIvanov"
        required={true}
      />
      <FormField
        title="Имя"
        type="text"
        id="first_name"
        onChange={inputChangeHandler}
        placeholder="Иван"
        required={false}
      />
      <FormField
        title="Фамилия"
        type="text"
        id="last_name"
        onChange={inputChangeHandler}
        placeholder="Иванов"
        required={false}
      />
      <FormField
        title="Телефон"
        type="tel"
        id="phone"
        onChange={inputChangeHandler}
        placeholder="+7 800 555 35 35"
        required={false}
      />
      <FormField
        title="Пароль"
        type="password"
        id="password"
        onChange={inputChangeHandler}
        placeholder="Латинские буквы и цифры"
        required={true}
      />
      <FormField
        title="Повторите пароль"
        type="password"
        id="password_check"
        onChange={inputChangeHandler}
        placeholder="Латинские буквы и цифры"
        required={true}
      />
      <div className="form__buttons-wrapper">
        <Button text="Зарегистрироваться" type="submit" selector="button_primary" />
        <Button text="Вход" onClick={() => navigate(Paths.SignIn)} selector="button_secondary" />
      </div>
    </Form>
  );
};
