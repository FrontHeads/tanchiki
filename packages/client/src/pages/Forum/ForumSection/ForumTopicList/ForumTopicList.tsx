import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../../../../config/constants';
import { type ForumTopicListProps } from './typings';

export const ForumTopicList: FC<ForumTopicListProps> = ({ topicList, sectionId }) => {
  return (
    <>
      <table border={1} className="forum">
        <thead className="forum__row-header">
          <tr>
            <th className="forum__cell-header">Темы</th>
            <th className="forum__cell-header">Ответы</th>
          </tr>
        </thead>
        <tbody className="forum__body">
          {topicList.map(topic => (
            <tr key={topic.id} data-testid={topic.id} className="forum__item">
              <td className="forum__first-column">
                <Link to={`${Paths.Section}/${sectionId}${Paths.Topic}/${topic.id}`}>{topic.name}</Link>
              </td>
              <td>{topic.messages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
