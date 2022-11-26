import './Menu.css';

import { FC, useState } from 'react';

import { MenuLink } from '../MenuLink';

const navigationList = [
  { id: 1, title: 'На главную', to: '/' },
  { id: 2, title: 'Игра', to: '/game' },
  { id: 3, title: 'Форум', to: '/forum' },
  { id: 4, title: 'Рейтинг игроков', to: '/leaderboard' },
  { id: 5, title: 'Авторизация', to: '/sign-in' },
  { id: 6, title: 'Регистрация', to: '/sign-up' },
  { id: 7, title: 'Профиль игрока', to: '/settings' },
  { id: 8, title: 'Ошибка 404', to: '/404' },
  { id: 9, title: 'Ошибка 404', to: '/500' },
  { id: 10, title: 'Выйти из аккаунта', to: '/logout' },
];
export const Menu: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = () => {
    setIsOpen(prevState => {
      return !prevState;
    });
  };

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <div className="menu">
      <div className="menu__icon" onClick={openMenu}>
        <div className="menu__icon-line"></div>
        <div className="menu__icon-line"></div>
        <div className="menu__icon-line"></div>
      </div>
      <div className={'menu__list ' + (isOpen ? '' : 'menu__list-hide')}>
        <nav className="index-nav">
          <ul className="navigation-list">
            {navigationList.map(({ id, title, to }) => (
              <MenuLink handleNavigate={handleNavigate} key={id} title={title} to={to} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
