import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { formInitialState, signUpFieldList } from './data';
import { SignUpForm } from './typings';

export const SignUp: FC = () => {
  // Оборачиваем в константу из-за каррирования в useAppDispatch() и useNavigate()
  // + хуки можно вызывать только на верхнем уровне компонента.
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);

  const [formData, setFormData] = useState<SignUpForm>(formInitialState);

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    },
    [formData]
  );

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(authThunks.signUp(formData));
    },
    [formData]
  );

  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Успех! Теперь одним танкистом больше!');
      navigate(Paths.Home);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Здесь обнуляем поле с ошибкой в хранилище, чтобы она не показывалась дважды в toast.
      dispatch(authActions.setError(''));
    }
  }, [error]);

  //TODO вынести цикл в отдельный универсальный компонент - FormFieldList
  // + взять логику из Profile и типизацию оттуда
  const formFieldList = signUpFieldList.map(field => {
    return <FormField key={field.id} {...field} onChange={inputChangeHandler} disabled={isLoading} />;
  });

  return (
    <Form handlerSubmit={submitHandler} header="Регистрация">
      <>{formFieldList}</>
      <div className="form__buttons-wrapper">
        <Button text="Зарегистрироваться" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Вход" onClick={() => navigate(Paths.SignIn)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
