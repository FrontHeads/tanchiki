import { Paths } from '../../config/constants';
import { MenuLinkProps } from '../MenuLink/typings';

export const NAVIGATION_LIST: Array<MenuLinkProps> = [
  { id: 'home', title: 'На главную', to: Paths.Home },
  { id: 'game', title: 'Игра', to: Paths.Game },
  { id: 'forum', title: 'Форум', to: Paths.Forum },
  { id: 'leaderboard', title: 'Рейтинг игроков', to: Paths.Leaderboard },
  { id: 'sign-in', title: 'Авторизация', to: Paths.SignIn },
  { id: 'sign-up', title: 'Регистрация', to: Paths.SignUp },
  { id: 'profile', title: 'Профиль игрока', to: Paths.UserProfile },
  { id: 'error-404', title: 'Ошибка 404', to: Paths.Error404 },
  { id: 'error-500', title: 'Ошибка 500', to: Paths.Error500 },
  { id: 'logout', title: 'Выход', to: Paths.Home },
];
