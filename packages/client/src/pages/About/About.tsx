import './About.css';

import React, { type FC } from 'react';
import { useLoaderData } from 'react-router-dom';

import { generateMetaTags } from '../../utils/seoUtils';
import { Creator } from './Creator';
import { type GithubCreator } from './Creator/typings';
import { Creators } from './data';

export const About: FC = () => {
  const githubCreators = useLoaderData() as GithubCreator[];
  const pageTitle = 'О проекте';

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <h1 className="about__title">{pageTitle}</h1>
      <section className="about">
        {Creators.map(creator => {
          return (
            <Creator
              key={creator.id}
              creator={creator}
              githubCreator={githubCreators.find(({ id }) => id === creator.id)}
            />
          );
        })}
      </section>
    </>
  );
};
