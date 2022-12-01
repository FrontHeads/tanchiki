import './Forum.css';

import { FC } from 'react';

import { DUMMY_FORUM } from './DummyData';
import { ForumProps } from './typing';
import { ForumTopic } from './ForumTopic';
import { Link } from 'react-router-dom';
import { Paths } from '../../config/constants';

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
          {DUMMY_FORUM.map(row => {
            return (
              <tr key={row.id} className="forum__row">
                <td className="forum__section">
                  <Link to={`${Paths.Section}/${row.id}`}>{row.name}</Link>
                </td>
                <td>{row.topicCount}</td>
                <td>{row.messages}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
