import { type UserProfile } from '../../../app.typings';

export type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string;
  userProfile: UserProfile | null;
};
