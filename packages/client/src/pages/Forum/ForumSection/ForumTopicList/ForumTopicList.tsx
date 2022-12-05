import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../../../../config/constants';
import { ForumTopicListProps } from './typings';

export const ForumTopicList: FC<ForumTopicListProps> = ({ topicList, sectionId }) => {
  return (
    <>
      {topicList.map(item => {
        return (
          <tr key={item.id} className="forum__item">
            <td className="forum__first-column">
              <Link to={`${Paths.Section}/${sectionId}${Paths.Topic}/${item.id}`}>{item.name}</Link>
            </td>
            <td>{item.messages}</td>
          </tr>
        );
      })}
    </>
  );
};
