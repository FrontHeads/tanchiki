import { UserProfile } from '../../../app.typings';

export interface AuthState {
  isLoading: boolean;
  error: string;
  userProfile: UserProfile | null;
}
