import './Creator.css';

import { type FC } from 'react';
import { Link } from 'react-router-dom';

import defaultAvatarPath from '/assets/img/default-avatar.png';

import { type CreatorProps, type GithubCreator } from './typings';

const getGithubAvatar = (githubCreator?: GithubCreator) => {
  if (githubCreator) {
    return githubCreator.avatar_url;
  }
  return defaultAvatarPath;
};

export const Creator: FC<CreatorProps> = ({ creator, githubCreator }) => {
  const avatarPath = getGithubAvatar(githubCreator);

  return (
    <div id={`creator-${creator.id}`} className="creator">
      <div className="creator__avatar">
        <img alt={`${creator.name} user avatar`} className="creator__avatar-image" src={avatarPath} />
      </div>
      <div className="creator__content">
        <div className="creator__meta">
          <span className="creator__username">{creator.name}</span>
          {githubCreator ? (
            <Link to={githubCreator.html_url} className="creator__info">
              @{githubCreator.login}
            </Link>
          ) : null}
        </div>
        <div className="creator__text">{creator.content}</div>
      </div>
    </div>
  );
};
