import { Paths } from '../../config/constants';
import { type MenuLinkProps } from '../MenuLink/typings';

export const NAVIGATION_LIST: Array<MenuLinkProps> = [
  { name: 'home', title: 'На главную', to: Paths.Home },
  { name: 'game', title: 'Игра', to: Paths.Game },
  { name: 'forum', title: 'Форум', to: Paths.Forum },
  { name: 'leaderboard', title: 'Рейтинг игроков', to: Paths.Leaderboard },
  { name: 'sign-in', title: 'Авторизация', to: Paths.SignIn },
  { name: 'sign-up', title: 'Регистрация', to: Paths.SignUp },
  { name: 'profile', title: 'Профиль игрока', to: Paths.UserProfile },
  { name: 'error-404', title: 'Ошибка 404', to: Paths.Error404 },
  { name: 'error-500', title: 'Ошибка 500', to: Paths.Error500 },
  { name: 'contact-us', title: 'Обратная связь', to: Paths.ContactUs },
  { name: 'logout', title: 'Выход', to: Paths.Home },
];
