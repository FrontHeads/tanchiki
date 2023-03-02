import { API_ENDPOINTS } from '../../config/constants';
import { type GithubCreator } from '../../pages/About/Creator/typings';
import { GitHubHTTP } from '../../utils/HTTP/GitHubHTTP';

export const githubAPI = {
  getAllCollaborators: () => GitHubHTTP.get<GithubCreator[]>(API_ENDPOINTS.GITHUB.GET_ALL_COLLABORATORS),
};
