import './ForumNewTopic.css';

import cn from 'classnames';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { forumAPI } from '../../../../api/forumAPI';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../../components/Breadcrumbs/data';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { ValidationErrors } from '../../../../components/ValidationErrors';
import { Paths } from '../../../../config/constants';
import { authSelectors, useAppSelector } from '../../../../store';
import { generateMetaTags } from '../../../../utils/seoUtils';
import { useValidation } from '../../../../utils/validation';
import { type ValidationErrorList } from '../../../../utils/validation/typings';

export const ForumNewTopic = () => {
  const navigate = useNavigate();
  const userId = useAppSelector(authSelectors.userProfile)?.id;
  const [topicHasErrors, setTopicHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const validation = useValidation([
    {
      title: 'Heading',
      type: 'text',
      id: 'heading',
      validator: 'NotEmpty',
      required: true,
    },
    {
      title: 'Message',
      type: 'text',
      id: 'message',
      validator: 'NotEmpty',
      required: true,
    },
  ]);

  const { sectionId } = useParams();

  const [form, setForm] = useState({
    heading: '',
    message: '',
  });

  const headingChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      const validationResult = validation({ heading: value });
      setValidationErrors(oldState => ({ ...oldState, heading: validationResult.errors.heading }));

      setForm(oldState => ({ ...oldState, heading: value }));
    },
    [form]
  );

  const messageChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;

      const validationResult = validation({ message: value });
      setValidationErrors(oldState => ({ ...oldState, message: validationResult.errors.message }));

      setForm(oldState => ({ ...oldState, message: value }));
    },
    [form]
  );

  const forumTopicClassNames = cn('forum-topic', {
    'form_has-errors': topicHasErrors,
  });

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = validation({ heading: form.heading, message: form.message });

      if (validationResult.hasErrors) {
        setTopicHasErrors(true);
        setValidationErrors(validationResult.errors);
        return;
      }

      forumAPI
        .createTopic({
          name: form.heading,
          content: form.message,
          section_id: Number(sectionId),
          user_id: userId,
        })

        .then(res => {
          navigate(`${Paths.Section}/${sectionId}${Paths.Topic}/${res.data.id}`);
        });
    },

    [form]
  );

  return (
    <>
      {generateMetaTags({ title: `${form.heading || 'Новая тема'}` })}
      <section className={forumTopicClassNames}>
        <h1 className="forum__title">{`${form.heading || 'Новая тема'}`}</h1>
        <Breadcrumbs variant={BreadcrumbsVariant.Normal} />
        <div className="new-topic__container">
          <form onSubmit={submitHandler} className="new-topic">
            {validationErrors.heading ? <ValidationErrors errorList={validationErrors.heading} /> : null}
            <input
              name="heading"
              id="heading"
              onChange={headingChangeHandler}
              className="new-topic__textarea textarea__heading"
              placeholder="Заголовок темы"
            />
            {validationErrors.message ? <ValidationErrors errorList={validationErrors.message} /> : null}
            <textarea
              name="message"
              id="message"
              className="new-topic__textarea textarea__content"
              rows={4}
              onChange={messageChangeHandler}
              placeholder="Содержание темы"
              value={form.message}
            />
            <div className="forum-topic__buttons-wrapper">
              <Button type="submit" text="Создать тему" variant={ButtonVariant.Primary} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
