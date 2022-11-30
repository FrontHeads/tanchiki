import { UserProfile } from '../../../app.typings';

export interface AppState {
  isLoading: boolean;
  userProfile: UserProfile | null;
}
