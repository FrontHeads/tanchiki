import './ForumNewTopic.css';

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { forumAPI } from '../../../../api/forumAPI';
import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../../components/Breadcrumbs/data';
import { type BreadcrumbsItem } from '../../../../components/Breadcrumbs/typings';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
import { Paths } from '../../../../config/constants';
import { generateMetaTags } from '../../../../utils/seoUtils';

export const ForumNewTopic = () => {
  const navigate = useNavigate();

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsItem[]>([{ href: Paths.Forum, title: 'Форум' }]);

  const { sectionId } = useParams();

  const [form, setForm] = useState({
    heading: 'Новая тема',
    body: '',
  });
  // console.log(breadcrumbs);


   useEffect(() => {
    // Should not ever set state during rendering, so do this in useEffect instead.
     setBreadcrumbs([...breadcrumbs, {href: `${Paths.Section}/${sectionId}`, title: 'Разделы' }]);
  }, [sectionId]);


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

      setForm(oldState => ({ ...oldState, body: value }));
    },
    [form]
  );

  const submitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
        forumAPI.createTopic({
          name: form.heading,
          content: form.body,
          //@ts-ignore
          section_id: sectionId,
          username: 'yatx',
          user_id: 1,
        }
      ).then((res) => {
        console.log(res);
        navigate(`${Paths.Section}/${sectionId}${Paths.Topic}/${res.data.id}`);

      });

    },

    [form]
  );

  return (
    <>
      {generateMetaTags({ title: `${form.heading}` })}
      <section className="forum-topic  ">
        <h1 className="forum__title">{`${form.heading}`}</h1>
        <Breadcrumbs data={breadcrumbs} variant={BreadcrumbsVariant.Normal} />
        <div className="new-topic__container">
          <form onSubmit={submitHandler} className="new-topic">
            <input
              name="heading"
              id="heading"
              onChange={headingChangeHandler}
              className="new-topic__textarea textarea__heading"
              placeholder="Заголовок темы"
            />
            <textarea
              name="message"
              id="message"
              className="new-topic__textarea textarea__content"
              rows={4}
              onChange={bodyChangeHandler}
              placeholder="Содержание темы"
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