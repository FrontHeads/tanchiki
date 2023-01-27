import { API_ENDPOINTS } from '../config/constants';
import { HTTP } from '../utils/HTTP';

type responseData = Record<string, never>;

type setUserThemeData = {
  themeName: string;
  userId: number;
};

export const themizationAPI = {
  getUserTheme: (userId: number) => HTTP.get<responseData>(API_ENDPOINTS.THEMIZATION.GET_USER_THEME(userId)),
  setUserTheme: (data: setUserThemeData) => HTTP.post<responseData>(API_ENDPOINTS.THEMIZATION.SET_USER_THEME, { data }),
};
