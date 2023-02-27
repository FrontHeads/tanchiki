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

  const emailClickHandler = (event: React.MouseEvent) => {
    const target = event.target;

    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }

    if (!target.classList.contains('creator__email_show')) {
      event.preventDefault();
      const adress = `${creator.partOne}@${creator.partTwo}`;
      target.textContent = adress;
      target.href = `mailto:${adress}`;
      target.classList.add('creator__email_show');
    }
  };

  return (
    <div id={`creator-${creator.id}`} className="creator">
      <div className="creator__avatar">
        <img alt={`${creator.name} user avatar`} className="creator__avatar-image" src={avatarPath} />
      </div>
      <div className="creator__content">
        <div className="creator__meta">
          <span className="creator__username">{creator.name}</span>

          {githubCreator ? (
            <span>
              Github:{' '}
              <Link to={githubCreator.html_url} className="creator__contact">
                @{githubCreator.login}
              </Link>
            </span>
          ) : null}
          {creator.partOne && creator.partTwo ? (
            <span>
              Email:{' '}
              <a href={'#'} className="creator__contact" onClick={emailClickHandler}>
                {'Показать'}
              </a>
            </span>
          ) : null}
        </div>
        <div className="creator__text" dangerouslySetInnerHTML={{ __html: creator.content }}></div>
      </div>
    </div>
  );
};
