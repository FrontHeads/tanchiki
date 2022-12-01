import './ForumSection.css';

import { FC } from 'react';

import { ForumSectionProps } from './typings';
import { Link, useParams } from 'react-router-dom';
import { DUMMY_SECTION } from '../DummyData';
import { Paths } from '../../../config/constants';

export const ForumSection: FC<ForumSectionProps> = () => {
  const { sectionId } = useParams();
  return (
    <section className="forum__wrapper">
      <h1 className="forum__title">Раздел {sectionId}</h1>
      <table border={1} className="forum">
        <thead className="forum__row-header">
          <tr>
            <th className="forum__cell-header">Темы</th>
            <th className="forum__cell-header">Ответы</th>
          </tr>
        </thead>
        <tbody className="forum__body">
          {DUMMY_SECTION.map(row => {
            return (
              <tr key={row.id} className="forum__row">
                <td className="forum__section">
                  <Link to={`${Paths.Section}/${sectionId}${Paths.Topic}/${row.id}`}>{row.name}</Link>
                </td>
                <td>{row.messages}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
