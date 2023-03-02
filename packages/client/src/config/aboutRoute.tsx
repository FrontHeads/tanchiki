import { type LoaderFunction } from 'react-router-dom';

import { githubAPI } from '../api/githubAPI';

/**
 * Предзагрузка данных about
 */
export const aboutLoader = (): LoaderFunction => {
  return async () => {
    const { data: githubCreator } = await githubAPI.getAllCollaborators();
    return githubCreator;
  };
};
