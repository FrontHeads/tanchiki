import { Paths } from '../../config/constants';

//TODO хорошо бы типизировать и этот тип использовать в Navigation.tsx
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
  { id: 10, name: 'logout', title: 'Выход', to: Paths.Home },
  //TODO id оставить все цифрами
  //TODO обернуть в Enum
];
