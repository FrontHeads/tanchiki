import './SignIn.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { LoginForm } from './typings';
import { Paths } from '../../config/constants';

export const SignIn: React.FC = () => {
  const formData: LoginForm = {login: '', password: ''};
  const [responseBody, setResponseBody] = useState<LoginForm>(formData);
  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      setResponseBody({...responseBody, [name]: value});
  };
  const navigate = useNavigate();
  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log(responseBody);
  };
  return (
      <Form handlerSubmit={submitHandler} header="Вход">
        <FormField title='Логин' type='login' id='login' onChange={inputChangeHandler} placeholder='ivanIvanov' required={true}/>
        <FormField title='Пароль' type='password' id='password' onChange={inputChangeHandler} placeholder='Латинские буквы и цифры' required={true}/>
        <div className='form__buttons-wrapper'>
          <Button text="Войти" type='submit' mod="full"/>
          <Button text="Регистрация" onClick={() => navigate(Paths.SignUp)} mod="empty"/>
        </div>
      </Form>
);
};
