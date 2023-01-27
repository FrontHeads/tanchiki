import './ForumNewTopic.css';

import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '../../../../components/Breadcrumbs';
import { BreadcrumbsVariant } from '../../../../components/Breadcrumbs/data';
// import { type BreadcrumbsItem } from '../../../../components/Breadcrumbs/typings';
import { Button } from '../../../../components/Button';
import { ButtonVariant } from '../../../../components/Button/data';
// import { Paths } from '../../../../config/constants';
import { useAppDispatch } from '../../../../store';
import { forumThunks } from '../../../../store/features/forum/forumThunks';
import { generateMetaTags } from '../../../../utils/seoUtils';
import { DUMMY_SECTION_BREADCRUMBS as breadcrumbs } from '../../DummyData';

export const ForumNewTopic = () => {
  // const navigate = useNavigate();

  // const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbsItem[]>([{ href: Paths.Forum, title: 'Форум' }]);

  const { sectionId } = useParams();

  // const topicId = async () => {
  //   const response = await forumAPI.getTopicsFromSection(Number(sectionId));

  //   console.log(sectionId);

  //   console.log(response.data);

  //   return response.data.at(-1);
  // };
  // topicId();

  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    heading: 'Новая тема',
    body: '',
  });
  // console.log(breadcrumbs);

  // setBreadcrumbs(oldState => [...oldState, { href: `${Paths.Section}/${sectionId}`, title: 'Разделы' }]);

  // dispatch(
  //   forumThunks.createTopic({
  //     id: 2,
  //     user_id: 1,
  //     section_id: 1,
  //     name: 'Вторая тема в первом разделе',
  //     content: 'Описание второй темы',
  //     username: 'yatx',
  //     messages: 3,
  //   })
  // );

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
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch(
        forumThunks.createTopic({
          name: form.heading,
          content: form.body,
          //@ts-ignore
          section_id: sectionId,
          username: 'yatx',
          user_id: 1,
        })
      );

      // navigate(`${Paths.Section}/${sectionId}/${Paths.Topic}/${topicId}`);
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
