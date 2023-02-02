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
  const user = useAppSelector(authSelectors.userProfile);
  const [topicHasErrors, setTopicHasErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const validation = useValidation([
    {
      title: 'Edit message',
      type: 'text',
      id: 'message',
      validator: 'NotEmpty',
      required: true,
    },
  ]);

  const userId = user?.id;

  const { sectionId } = useParams();

  const [form, setForm] = useState({
    heading: 'Новая тема',
    body: '',
  });

  const headingChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setForm(oldState => ({ ...oldState, heading: value }));
    },
    [form]
  );
  const bodyChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;

      const validationResult = validation({ message: value });
      setValidationErrors(validationResult.errors);

      setForm(oldState => ({ ...oldState, body: value }));
    },
    [form]
  );

  const forumTopicClassNames = cn('forum-topic', {
    'form_has-errors': topicHasErrors,
  });

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = validation({ message: form.body });

      if (validationResult.hasErrors) {
        setTopicHasErrors(true);
        setValidationErrors(validationResult.errors);
        return;
      }

      forumAPI
        .createTopic({
          name: form.heading,
          content: form.body,
          section_id: Number(sectionId),
          user_id: userId,
        })

        .then(res => {
          navigate(`${Paths.Section}/${sectionId}${Paths.Topic}/${res.data.id}`);
        });
    },

    [form]
  );

  return user ? (
    <>
      {generateMetaTags({ title: `${form.heading}` })}
      <section className={forumTopicClassNames}>
        <h1 className="forum__title">{`${form.heading}`}</h1>
        <Breadcrumbs variant={BreadcrumbsVariant.Normal} />
        <div className="new-topic__container">
          <form onSubmit={submitHandler} className="new-topic">
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
              onChange={bodyChangeHandler}
              placeholder="Содержание темы"
              value={form.body}
            />
            <div className="forum-topic__buttons-wrapper">
              <Button type="submit" text="Создать тему" variant={ButtonVariant.Primary} />
            </div>
          </form>
        </div>
      </section>
    </>
  ) : null;
};
