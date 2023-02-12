import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  type UpdatePasswordRequestData,
  type UpdateProfileAvatarRequestData,
  type UpdateProfileRequestData,
  userAPI,
} from '../../../api/userAPI/userAPI';
import { type UserProfile } from '../../../app.typings';
import { type RootState } from '../../store';
import { me } from '../auth/authThunks';
import { type UpdateAllProfileData, type UpdateResult } from './typings';

/**
 * В зависимости от полученного статуса промиса, создаем сообщение либо об ошибке, либо об успешном обновлении полей
 * и добавляем его в массив
 * */
const setUpdateResult = <T extends PromiseSettledResult<unknown>>(
  arr: UpdateResult,
  oldObj: T,
  successMessage: string
) => {
  if (Array.isArray(arr)) {
    if (oldObj.status === 'fulfilled' && oldObj.value) {
      arr.push({
        type: 'success',
        message: successMessage,
      });
    }
    if (oldObj.status === 'rejected') {
      arr.push({
        type: 'error',
        message: oldObj.reason.message,
      });
    }
  }
};

/**
 *  Проверяем было ли хоть одно поле профиля изменено
 * */
const isProfileDirty = (profileState: UserProfile | null, profileFields: UpdateProfileRequestData) => {
  if (profileState) {
    return !Object.entries(profileFields).every(([key, value]) => value === profileState[key as keyof UserProfile]);
  }
  return false;
};

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (allProfileData: UpdateAllProfileData, { dispatch, getState }) => {
    const profileState = (getState() as RootState).auth.userProfile;
    const { oldPassword, newPassword, avatarFile, ...profileFields } = allProfileData;

    // Поле не должно попасть в запрос
    delete profileFields.avatar;

    let passwordData: UpdatePasswordRequestData | null = null;
    let avatarData: UpdateProfileAvatarRequestData | null = null;
    let profileData: UpdateProfileRequestData | null = null;

    if (isProfileDirty(profileState, profileFields)) {
      profileData = profileFields;
    }

    if (oldPassword.length && newPassword.length) {
      passwordData = { oldPassword, newPassword };
    }

    if (avatarFile) {
      avatarData = new FormData();
      avatarData.append('avatar', avatarFile);
    }

    const [profileUpdateResult, passwordUpdateResult, avatarUpdateResult] = await Promise.allSettled([
      profileData ? userAPI.updateProfile(profileData) : Promise.resolve(),
      passwordData ? userAPI.updatePassword(passwordData) : Promise.resolve(),
      avatarData ? userAPI.updateProfileAvatar(avatarData) : Promise.resolve(),
    ]);

    const updateResult: UpdateResult = [];

    setUpdateResult(updateResult, profileUpdateResult, 'Поля успешно обновлены');
    setUpdateResult(updateResult, passwordUpdateResult, 'Пароль успешно обновлен');
    setUpdateResult(updateResult, avatarUpdateResult, 'Аватар успешно обновлен');

    // Не обновляем страницу если ничего не было изменено
    if (updateResult.length) {
      await dispatch(me());
    }
    return updateResult;
  }
);

export const profileThunks = { updateProfile };
