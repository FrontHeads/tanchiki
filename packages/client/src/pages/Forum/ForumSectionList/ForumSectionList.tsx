import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../../../config/constants';
import { ForumSectionListProps } from './typings';

export const ForumSectionList: FC<ForumSectionListProps> = ({ sectionList }) => {
  return (
    <>
      {sectionList.map(item => {
        return (
          <tr key={item.id} className="forum__item">
            <td className="forum__first-column">
              <Link to={`${Paths.Section}/${item.id}`}>{item.name}</Link>
            </td>
            <td>{item.topicCount}</td>
            <td>{item.messages}</td>
          </tr>
        );
      })}
    </>
  );
};
