import { UserProfile } from '../../../app.typings';

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string;
  userProfile: UserProfile | null;
}
