import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  UpdatePasswordRequestData,
  UpdateProfileAvatarRequestData,
  UpdateProfileRequestData,
  userAPI,
} from '../../../api/userAPI';
import { UserProfile } from '../../../app.typings';
import { RootState } from '../../store';
import { me } from '../auth/authThunks';
import { UpdateAllProfileData, UpdateResult } from './typings';

/**
 * Создаем и присваиваем в массив сообщения об ошибках,
 * либо об успешном обновлении полей, в зависимости от полученного статуса промиса
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
