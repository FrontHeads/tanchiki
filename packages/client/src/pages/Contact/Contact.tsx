import React, { type FC, useState } from 'react';
import { toast } from 'react-toastify';

import { contactAPI } from '../../api/contactAPI';
import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { generateMetaTags } from '../../utils/seoUtils';
import { contactUsFieldList, contactUsFormInitialState } from './data';
import { type ContactUsForm } from './typings';

export const Contact: FC = () => {
  const pageTitle = 'Обратная связь';

  const [formData, setFormData] = useState<ContactUsForm>(contactUsFormInitialState);

  const onFormSubmitCallback = () => {
    let message = `Email: ${formData.email}\nСообщение: \n${formData.message}`;
    if (formData.name) {
      message = `От: ${formData.name}\n${message}`;
    }

    Promise.allSettled([contactAPI.sendToSlack({ text: message }), contactAPI.send(formData)]).then(response => {
      const isSuccess = response.some(v => v.status === 'fulfilled');

      if (isSuccess) {
        toast.success('Сообщение успешно отправлено!');
        setFormData(contactUsFormInitialState);
      } else {
        toast.error('Ошибка отправки сообщения. Попробуйте снова');
      }
    });
  };

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <Form header={pageTitle}>
        <FieldList<ContactUsForm>
          fieldList={contactUsFieldList}
          onFormSubmitCallback={onFormSubmitCallback}
          formData={formData}
          setFormData={setFormData}
        />
        <div className="form__buttons-wrapper">
          <Button data-testid="contact-submit-button" text="Отправить" type="submit" variant={ButtonVariant.Primary} />
        </div>
      </Form>
    </>
  );
};
