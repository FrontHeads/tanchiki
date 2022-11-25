import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { LoginForm } from './typings';

export const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const formData: LoginForm = { login: '', password: '' };
  const [responseBody, setResponseBody] = useState<LoginForm>(formData);

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(responseBody);
  };

  return (
    <Form handlerSubmit={submitHandler} header="Вход">
      <FormField
        title="Логин"
        type="login"
        id="login"
        onChange={inputChangeHandler}
        placeholder="ivanIvanov"
        required={true}
      />
      <FormField
        title="Пароль"
        type="password"
        id="password"
        onChange={inputChangeHandler}
        placeholder="Латинские буквы и цифры"
        required={true}
      />
      <div className="form__buttons-wrapper">
        <Button text="Войти" type="submit" selector="button_primary" />
        <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} selector="button_secondary" />
      </div>
    </Form>
  );
};
