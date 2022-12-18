export type UserProfileForm = {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
  avatar: string;
};

export type AvatarFile = File | null;
