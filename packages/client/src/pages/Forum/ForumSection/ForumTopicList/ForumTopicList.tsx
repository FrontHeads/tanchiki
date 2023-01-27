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
          {topicList.map(item => (
            <tr key={item.id} data-testid={item.id} className="forum__item">
              <td className="forum__first-column">
                <Link to={`${Paths.Section}/${sectionId}${Paths.Topic}/${item.id}`}>{item.name}</Link>
              </td>
              <td>{item.messages}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
