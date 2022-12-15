import './UserProfile.css';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { PATH } from '../../config/constants';
import { authSelectors, me, profileSelectors, profileThunks, useAppDispatch, useAppSelector } from '../../store';
import { userProfileFieldList } from './data';
import { UserProfileForm } from './typings';

export const UserProfile: FC = () => {
  const dispatch = useAppDispatch();

  const { userProfile } = useAppSelector(authSelectors.all);
  const { updateResult, isProfileLoading } = useAppSelector(profileSelectors.all);

  const userFormData: UserProfileForm = {
    email: userProfile?.email ?? '',
    login: userProfile?.login ?? '',
    first_name: userProfile?.first_name ?? '',
    second_name: userProfile?.second_name ?? '',
    display_name: userProfile?.display_name ?? '',
    phone: userProfile?.phone ?? '',
    oldPassword: '',
    newPassword: '',
    avatar: '',
  };

  const [formData, setFormData] = useState<UserProfileForm>(userFormData);

  useEffect(() => {
    if (userProfile === null) {
      dispatch(me());
    }
  }, [userProfile]);

  useEffect(() => {
    if (updateResult) {
      updateResult.map(({ type, message }) => {
        toast(message, { type: type });
      });
    }
  }, [updateResult]);

  const submitHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Get avatar file
      let avatarFile: File | undefined;

      if (event.target instanceof HTMLFormElement) {
        const avatarInput = event.target.querySelector(`#avatar`);
        if (avatarInput instanceof HTMLInputElement && avatarInput.files && avatarInput.files.length) {
          avatarFile = avatarInput.files[0];
        }
      }

      dispatch(profileThunks.updateProfile({ ...formData, avatarFile: avatarFile }));

      setFormData({ ...formData, avatar: '', oldPassword: '', newPassword: '' });
    },
    [formData]
  );

  const avatarPath = userProfile?.avatar ? PATH.avatarBase + userProfile?.avatar : PATH.defaultAvatar;
  const header = userProfile?.first_name;

  return (
    <div className="user-profile">
      <img src={avatarPath} alt={`Аватар пользователя ${header}`} className="avatar-img avatar-img__big" />

      <Form handlerSubmit={submitHandler} header={header}>
        <FieldList
          fieldList={userProfileFieldList}
          setFormData={setFormData}
          formData={formData}
          disabled={isProfileLoading}
        />
        <div className="form__buttons-wrapper">
          <Button text="Сохранить изменения" type="submit" variant={ButtonVariant.Primary} />
        </div>
      </Form>
    </div>
  );
};
