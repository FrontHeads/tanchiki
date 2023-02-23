import { Paths } from '../../config/constants';
import { type MenuLinkProps } from '../MenuLink/typings';

/**
 * https://stackoverflow.com/a/60496830
 * "Прогоняем" через функцию для получения union типа значений name, который
 * можно получить следующим образом typeof NAVIGATION_LIST[number]['name']
 **/
function createPairsArray<T extends Readonly<Array<MenuLinkProps>> & Array<{ name: V }>, V extends string>(...args: T) {
  return args;
}

export const NAVIGATION_LIST = createPairsArray(
  { name: 'home', title: 'На главную', to: Paths.Home },
  { name: 'game', title: 'Игра', to: Paths.Game },
  { name: 'forum', title: 'Форум', to: Paths.Forum, accessLevel: 'protected', displayOption: 'disableIfClientOnly' },
  { name: 'leaderboard', title: 'Рейтинг игроков', to: Paths.Leaderboard, accessLevel: 'protected' },
  { name: 'sign-in', title: 'Авторизация', to: Paths.SignIn, accessLevel: 'guest' },
  { name: 'sign-up', title: 'Регистрация', to: Paths.SignUp, accessLevel: 'guest' },
  { name: 'profile', title: 'Профиль игрока', to: Paths.UserProfile, accessLevel: 'protected' },
  { name: 'contact-us', title: 'Обратная связь', to: Paths.ContactUs, displayOption: 'disableIfClientOnly' },
  { name: 'logout', title: 'Выход', to: Paths.Home, accessLevel: 'protected' }
);
