import React, { type FC, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { useAppDispatch } from '../../store';
import { contactThunks } from '../../store/features/contact/contactThunks';
import { generateMetaTags } from '../../utils/seoUtils';
import { useValidation } from '../../utils/validation';
import { contactUsFieldList, contactUsFormInitialState } from './data';
import { type ContactUsForm } from './typings';

export const Contact: FC = () => {
  const dispatch = useAppDispatch();
  const validation = useValidation(contactUsFieldList);
  const pageTitle = 'Обратная связь';

  const [formData, setFormData] = useState<ContactUsForm>(contactUsFormInitialState);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFormSubmitted(true);
  }, []);

  const onFormSubmitCallback = () => {
    dispatch(contactThunks.send(formData))
      .unwrap()
      .then(() => {
        toast.success('Сообщение успешно отправлено!');
      })
      .catch(e => {
        toast.error(e.message);
      });
  };

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <Form onSubmitHandler={onFormSubmit} header={pageTitle}>
        <FieldList<ContactUsForm>
          fieldList={contactUsFieldList}
          isFormSubmitted={isFormSubmitted}
          setIsFormSubmitted={setIsFormSubmitted}
          onFormSubmitCallback={onFormSubmitCallback}
          formData={formData}
          setFormData={setFormData}
          validation={validation}
        />
        <div className="form__buttons-wrapper">
          <Button text="Отправить" type="submit" variant={ButtonVariant.Primary} />
        </div>
      </Form>
    </>
  );
};
