import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';
import { type responseData, type setUserThemeData } from './typings';

export const themizationAPI = {
  getUserTheme: async () => {
    const response = await HTTP.get<responseData>(API_ENDPOINTS.THEMIZATION);
    return response.data;
  },
  setUserTheme: (data: setUserThemeData) => HTTP.post<responseData>(API_ENDPOINTS.THEMIZATION, { data }),
};
