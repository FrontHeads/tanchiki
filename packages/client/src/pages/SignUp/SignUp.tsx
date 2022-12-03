import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { signUpInputFields } from './data';
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
      dispatch(authThunks.signUp(requestBody));
      window.scrollTo(0, 0);
    },
    [requestBody]
  );

  const inputFields = signUpInputFields.map(field => {
    return <FormField key={field.id} {...field} onChange={inputChangeHandler} disabled={isLoading} />;
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Успех! Теперь одним танкистом больше!');
      navigate(Paths.Home);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      dispatch(authActions.setError(''));
      toast.error(error);
    }
  }, [error]);

  return (
    <Form handlerSubmit={submitHandler} header="Регистрация">
      <>{inputFields}</>
      <div className="form__buttons-wrapper">
        <Button text="Зарегистрироваться" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Вход" onClick={() => navigate(Paths.SignIn)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
