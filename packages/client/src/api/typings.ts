import { type SortOption } from '../store/features/leaderboard/typings';
import { type LEADERBOARD_TEAM_NAME } from '../config/constants';

export type APIError = {
  reason: string;
};

export type UserDTO = {
  id: number;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
  role?: string;
};

export type LeaderboardRecordData = {
  username: string;
  score: number;
  time: number;
  matches: number;
  rate: number;
};

export type LeaderboardRecord = { data: LeaderboardRecordData };

export type GetLeaderboardResponseData = Array<LeaderboardRecord>;

export type NewLeaderboardRecordRequest = {
  data: LeaderboardRecordData;

  /** Какое поле используется для сортировки(данные сохраняются, если новое значение больше старого) */
  ratingFieldName: SortOption;

  /**Название команды. Используется чтобы создоть уникольный лидерборд для каждого проекта (взято из Swagger) */
  teamName: typeof LEADERBOARD_TEAM_NAME;
};

export type LeaderboardRequest = {
  ratingFieldName: SortOption;

  /**Используется для пагинации. Если limit=10, для 1-ой страницы cursor=0, для 2-ой cursor=10 */
  cursor: number;

  /**Сколько записей возвращить на одну страницу */
  limit: number;
};
