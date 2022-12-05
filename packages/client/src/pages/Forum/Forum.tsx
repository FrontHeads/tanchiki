import './Forum.css';

import { FC } from 'react';

import { DUMMY_FORUM as sectionList } from './DummyData';
import { ForumProps } from './typing';
import { ForumTopic } from './ForumTopic';
import { Link } from 'react-router-dom';
import { Paths } from '../../config/constants';
import { ForumSectionList } from './ForumSectionList';

export const headerText = 'Рейтинг игроков';

export const Forum: FC<ForumProps> = () => {
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title">Форум</h1>
      <table border={1} className="forum">
        <thead className="forum__row-header">
          <tr>
            <th className="forum__cell-header">Разделы</th>
            <th className="forum__cell-header">Темы</th>
            <th className="forum__cell-header">Ответы</th>
          </tr>
        </thead>
        <tbody className="forum__body">
          <ForumSectionList sectionList={sectionList} />
        </tbody>
      </table>
    </section>
  );
};
