import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';

type responseData = Record<string, never>;

type setUserThemeData = {
  themeName: string;
};

export const themizationAPI = {
  getUserTheme: async () => {
    const response = await HTTP.get<responseData>(API_ENDPOINTS.THEMIZATION);
    return response.data;
  },
  setUserTheme: (data: setUserThemeData) => HTTP.post<responseData>(API_ENDPOINTS.THEMIZATION, { data }),
};
