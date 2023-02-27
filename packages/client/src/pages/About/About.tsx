import './About.css';

import React, { type FC } from 'react';
import { useLoaderData } from 'react-router-dom';

import { generateMetaTags } from '../../utils/seoUtils';
import { Creator } from './Creator';
import { type GithubCreator } from './Creator/typings';
import { Creators, crew, introduction, pageTitle } from './data';

export const About: FC = () => {
  const githubCreators = useLoaderData() as GithubCreator[];

  return (
    <>
      {generateMetaTags({ title: pageTitle })}
      <h1 className="about__title">{pageTitle}</h1>
      <section className="about" dangerouslySetInnerHTML={{ __html: introduction }}></section>
      <h2 className="about__title">{crew}</h2>
      <section className="about">
        {Creators.sort(() => Math.random() - 0.5).map(creator => {
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
