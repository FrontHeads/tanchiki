import { LEADERBOARD_TEAM_NAME, YANDEX_API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';
import { ResponseType } from './../utils/HTTP/HTTP';
import {
  GetLeaderboardResponseData,
  LeaderboardRecord,
  LeaderboardRequest,
  NewLeaderboardRecordRequest,
} from './typings';

export const leaderboardAPI = {
  addScore: (data: NewLeaderboardRecordRequest) => HTTP.post(YANDEX_API_ENDPOINTS.LEADERBOARD.ADD_SCORE, { data }),
  getLeaderboard: (data: LeaderboardRequest) =>
    HTTP.post<GetLeaderboardResponseData>(YANDEX_API_ENDPOINTS.LEADERBOARD.GET(LEADERBOARD_TEAM_NAME), { data })
      .then(validateLeaderboard)
      .then(calculateScoreRates),
};

const validateLeaderboard = (response: ResponseType<GetLeaderboardResponseData>) => {
  /**Валидируем поля */
  const validatedData = response.data.filter((record: LeaderboardRecord) => {
    const { data } = record;
    const isValidNumber = (num: number) => {
      return typeof num === 'number' && num >= 0 && num % 1 === 0;
    };

    const usernameLimitation =
      typeof data.username !== 'string' || data.username.trim() === '' || data.username.length > 20;

    const scoreLimitation = !isValidNumber(data.score) || data.score > 9999999;

    const timeLimitation = !isValidNumber(data.time) || data.time > 3.564e8; //3.564e8 === 99 часов

    const matchesLimitation = !isValidNumber(data.matches) || data.matches > 999;

    if (usernameLimitation || scoreLimitation || timeLimitation || matchesLimitation) return false;

    return true;
  });
  return { ...response, data: validatedData };
};

const calculateScoreRates = (response: ResponseType<GetLeaderboardResponseData>) => {
  const data = response.data.map(item => {
    item.data.rate = Math.round(item.data.score / (item.data.time / 60000));
    return item;
  });

  return { ...response, data };
};
