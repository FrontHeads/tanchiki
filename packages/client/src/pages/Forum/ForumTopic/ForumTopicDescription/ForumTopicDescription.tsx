import cn from 'classnames';
import { type FC, useCallback, useState } from 'react';

import { forumAPI } from '../../../../api/forumAPI';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { Dropdown } from '../../../../components/Dropdown';
import { type DropdownMenuItems } from '../../../../components/Dropdown/typings';
import { ValidationErrors } from '../../../../components/ValidationErrors';
import { authSelectors, useAppSelector } from '../../../../store';
import simplifyDate from '../../../../utils/dateUtils';
import { useValidation } from '../../../../utils/validation';
import { type ValidationErrorList } from '../../../../utils/validation/typings';
import { type ForumTopicDescriptionProps } from './typings';

export const ForumTopicDescription: FC<ForumTopicDescriptionProps> = props => {
  const { displayName, date, topicId, authorId, avatarPath } = props;
  const userId = useAppSelector(authSelectors.userProfile)?.id;

  // Проверяем, является ли пользователь создателем темы.
  const isAuthor = authorId === userId;

  const [description, setDescription] = useState<string>(props.description);
  const [isEditDescription, setIsEditDescription] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrorList>({});
  const [formHasErrors, setFormHasErrors] = useState(false);

  const validation = useValidation([
    {
      title: 'Message',
      type: 'text',
      id: 'message',
      validator: 'forumText',
      required: true,
    },
  ]);

  const descriptionChangeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    const validationResult = validation({ message: value });

    setValidationErrors(validationResult.errors);
    setDescription(value);
  }, []);

  const editTopicDescription = () => {
    setIsEditDescription(true);
  };

  const submitHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const validationResult = validation({ message: description });

      if (validationResult.hasErrors) {
        setFormHasErrors(true);
        setValidationErrors(validationResult.errors);
        return;
      }
      forumAPI
        .editTopic(topicId, { content: description })
        .then(res => {
          setDescription(res.data.content);
        })
        .catch(e => {
          throw new Error(e.message);
        });
      setIsEditDescription(false);
    },
    [description]
  );
  const forumMessageClassNames = cn('forum-message', {
    'form_has-errors': formHasErrors,
  });

  const menuItems: DropdownMenuItems[] = [{ onClick: editTopicDescription, title: 'Редактировать' }];

  return (
    <div className={forumMessageClassNames}>
      <div className="forum-message__avatar">
        <img alt={`${displayName} user avatar`} className="forum-message__avatar-image" src={avatarPath} />
      </div>
      <div className="forum-message__content">
        <div className="forum-message__meta">
          <span className="forum-message__username">{displayName}</span>
          <time className="forum-message__date">{simplifyDate(date)}</time>
        </div>
        {isEditDescription ? (
          <>
            {validationErrors.message ? <ValidationErrors errorList={validationErrors.message} /> : null}
            <form onSubmit={submitHandler} className="textarea__content">
              <textarea
                rows={4}
                name="description"
                id="description"
                className="forum-topic__textarea"
                onChange={descriptionChangeHandler}
                defaultValue={description}
              />
              <Button type="submit" text="Изменить описание" variant={ButtonVariant.Secondary} />
            </form>
          </>
        ) : (
          <div className="forum-message__text">{description}</div>
        )}
      </div>
      {isAuthor ? (
        <Dropdown
          trigger={
            <div className="forum-message__options">
              <svg
                aria-label="Show options"
                role="img"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true">
                <path d="M8 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM1.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
            </div>
          }
          menuItems={menuItems}
        />
      ) : null}
    </div>
  );
};
