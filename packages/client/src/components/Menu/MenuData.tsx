import { Paths } from '../../config/constants';

export const navigationList = [
  { id: 1, title: 'На главную', to: Paths.Home },
  { id: 2, title: 'Игра', to: Paths.Game },
  { id: 3, title: 'Форум', to: Paths.Forum },
  { id: 4, title: 'Рейтинг игроков', to: Paths.Leaderboard },
  { id: 5, title: 'Авторизация', to: Paths.SignIn },
  { id: 6, title: 'Регистрация', to: Paths.SignUp },
  { id: 7, title: 'Профиль игрока', to: Paths.UserProfile },
  { id: 8, title: 'Ошибка 404', to: Paths.Error404 },
  { id: 9, title: 'Ошибка 500', to: Paths.Error500 },
];
export const logoutItem = { id: 10, title: 'Выход', to: '#' };
