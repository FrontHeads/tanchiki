import { TEAM_NAME, YANDEX_API_ENDPOINTS } from '../config/constants';
import { LeaderboardRecord, LeaderboardRowProps } from '../pages/Leaderboard/LeaderboardRow/typings';
import { SortOption } from '../pages/Leaderboard/typings';
import { HTTP } from '../utils/HTTP';
import { ResponseType } from './../utils/HTTP/HTTP';

export type ReceivedRecordData = {
  username: string;
  score: number;
  time: number;
  matches: number;
};

export type NewLeaderboardRecordRequest = {
  data: LeaderboardRecord;

  /** Какое поле используется для сортировки(данные сохраняются, если новое значение больше старого) */
  ratingFieldName: string;

  /**Название команды. Используется чтобы создоть уникольный лидерборд для каждого проекта (взято из Swagger) */
  teamName: typeof TEAM_NAME;
};

export type LeaderboardRequest = {
  ratingFieldName: SortOption;

  /**Используется для пагинации. Если limit=10, для 1-ой страницы cursor=0, для 2-ой cursor=10 */
  cursor: number;

  /**Сколько записей возвращить на одну страницу */
  limit: number;
};

type GetLeaderboardResponseData = LeaderboardRowProps[];
export const leaderboardAPI = {
  addScore: (data: LeaderboardRecord) => HTTP.post(YANDEX_API_ENDPOINTS.LEADERBOARD.ADD_SCORE, { data }),
  getLeaderboard: (data: LeaderboardRequest) =>
    HTTP.post<GetLeaderboardResponseData>(YANDEX_API_ENDPOINTS.LEADERBOARD.GET(TEAM_NAME), { data }).then(
      validateLeaderboard
    ),
};

const validateLeaderboard = (response: ResponseType<GetLeaderboardResponseData>) => {
  /**Валидируем поля */
  const validatedData = response.data
    .filter((record: LeaderboardRowProps) => {
      const { data } = record;

      const isValidNumber = (num: number) => {
        return typeof num === 'number' && num >= 0 && num % 1 === 0;
      };
      if (typeof data.username !== 'string' || data.username.trim() === '') return false;
      if (!isValidNumber(data.score) || !isValidNumber(data.time) || !isValidNumber(data.matches)) return false;

      return true;
    })
    /**Назначаем место в таблице рейтинга */
    .map((item: LeaderboardRowProps, index: number) => {
      item.data.place = index + 1;
      return item;
    });
  return { ...response, data: validatedData };
};
