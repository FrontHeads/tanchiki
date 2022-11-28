import './Menu.css';

import { FC, useState } from 'react';

import menuIcon from '../../assets/img/menu_icon.png';
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
    <div data-testid="menu" className="menu">
      <div data-testid="menu-button" className="menu__icon" onClick={openMenu}>
        <img src={menuIcon} alt="menu button" />
      </div>
      <div
        data-testid='menu-list'
        data-test={isOpen ? 'menu-list-on' : 'menu-list-off'}
        className={'menu__list ' + (isOpen ? '' : 'menu__list-hide')}>
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
