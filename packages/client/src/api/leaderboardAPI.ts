import { YANDEX_API_ENDPOINTS } from '../config/constants';
import { LeaderboardFields } from '../pages/Leaderboard/typings';
import { HTTP } from '../utils/HTTP';
import { TEAM_NAME } from './../config/constants';
import { LeaderboardRecord } from './../pages/Leaderboard/LeaderboardRow/typings';

export type NewLeaderboardRecordRequest = {
  data: LeaderboardRecord;

  /** Какое поле используется для сортировки(данные сохраняются, если новое значение больше старого) */
  ratingFieldName: string;

  /**Название команды. Используется чтобы создоть уникольный лидерборд для каждого проекта (взято из Swagger) */
  teamName: typeof TEAM_NAME;
};

export type LeaderboardRequest = {
  ratingFieldName: LeaderboardFields;

  /**Используется для пагинации. Если limit=10, для 1-ой страницы cursor=0, для 2-ой cursor=10 */
  cursor: number;

  /**Сколько записей возвращить на одну страницу */
  limit: number;
};

export const leaderboardAPI = {
  addScore: (data: LeaderboardRecord) => HTTP.post(YANDEX_API_ENDPOINTS.LEADERBOARD.ADD_SCORE, { data }),
  getLeaderboard: (data: LeaderboardRequest) => HTTP.post(YANDEX_API_ENDPOINTS.LEADERBOARD.GET(TEAM_NAME), { data }),
};