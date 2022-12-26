import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { Paths } from '../../config/constants';
import { authActions, authSelectors, authThunks, useAppDispatch, useAppSelector } from '../../store';
import { useValidation, ValidationResponse } from '../../utils/validation';
import { signUpFieldList, signUpFormInitialState } from './data';
import { SignUpForm } from './typings';
export const SignUp: FC = () => {
  // Оборачиваем в константу из-за каррирования в useAppDispatch() и useNavigate()
  // + хуки можно вызывать только на верхнем уровне компонента.
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useAppSelector(authSelectors.all);

  const [formHasErrors, setFormHasErrors] = useState(false);
  const [formData, setFormData] = useState<SignUpForm>(signUpFormInitialState);
  const [validationErrors, setValidationErrors] = useState({} as ValidationResponse);
  const validation = useValidation(signUpFieldList);

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResponse = validation(formData);

      if (validationResponse?.hasErrors) {
        setFormHasErrors(true);
        setValidationErrors(validationResponse);
        return;
      }

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

  return (
    <Form onSubmitHandler={submitHandler} header="Регистрация" hasErrors={formHasErrors}>
      <FieldList<SignUpForm>
        fieldList={signUpFieldList}
        setFormData={setFormData}
        formData={formData}
        disabled={isLoading}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        validation={validation}
      />
      <div className="form__buttons-wrapper">
        <Button text="Зарегистрироваться" type="submit" variant={ButtonVariant.Primary} disabled={isLoading} />
        <Button text="Вход" onClick={() => navigate(Paths.SignIn)} variant={ButtonVariant.Secondary} />
      </div>
    </Form>
  );
};
