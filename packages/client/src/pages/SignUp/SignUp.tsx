import { type FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { signUpFieldList, signUpFormInitialState } from './data';
import { type SignUpForm } from './typings';

export const SignUp: FC = () => {
  // Оборачиваем в константу из-за каррирования в useAppDispatch() и useNavigate()
  // + хуки можно вызывать только на верхнем уровне компонента.
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pageTitle = 'Регистрация';

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);

  const [formData, setFormData] = useState<SignUpForm>(signUpFormInitialState);

  const onFormSubmitCallback = () => {
    dispatch(authThunks.signUp(formData));
  };

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

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <Form header={pageTitle}>
        <FieldList<SignUpForm>
          fieldList={signUpFieldList}
          onFormSubmitCallback={onFormSubmitCallback}
          formData={formData}
          setFormData={setFormData}
          disabled={isLoading}
        />
        <div className="form__buttons-wrapper">
          <Button text="Зарегистрироваться" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
          <Button text="Вход" onClick={() => navigate(Paths.SignIn)} variant={ButtonVariant.Secondary} />
        </div>
      </Form>
    </>
  );
};
