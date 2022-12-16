export type UpdateResult = {
  type: 'error' | 'success';
  message: string;
}[];

export type ProfileState = {
  isProfileLoading: boolean;
  updateResult: UpdateResult;
};
export type UpdateAllProfileData = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
  avatarFile: File | null;
  avatar?: string;
};
