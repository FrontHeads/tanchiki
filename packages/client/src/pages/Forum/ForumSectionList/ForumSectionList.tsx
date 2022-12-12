import { FC } from 'react';
import { Link } from 'react-router-dom';

import { Paths } from '../../../config/constants';
import { ForumSectionListProps } from './typings';

export const ForumSectionList: FC<ForumSectionListProps> = ({ sectionList }) => {
  return (
    <>
      <thead className="forum__row-header">
        <tr>
          <th className="forum__cell-header">Разделы</th>
          <th className="forum__cell-header">Темы</th>
          <th className="forum__cell-header">Ответы</th>
        </tr>
      </thead>
      <tbody className="forum__body">
        {sectionList.map(item => (
          <tr key={item.id} data-testid={item.id} className="forum__item">
            <td className="forum__first-column">
              <Link to={`${Paths.Section}/${item.id}`}>{item.name}</Link>
            </td>
            <td>{item.topicCount}</td>
            <td>{item.messages}</td>
          </tr>
        ))}
      </tbody>
    </>
  );
};
