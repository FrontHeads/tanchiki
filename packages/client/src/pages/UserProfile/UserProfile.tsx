import './UserProfile.css';

import React, { type FC, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/data';
import { Form } from '../../components/Form';
import { FieldList } from '../../components/Form/FieldList';
import { AVATAR } from '../../config/constants';
import { buildPath, determineBaseUrl } from '../../utils/HTTP';
import { authSelectors, profileSelectors, profileThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { useValidation } from '../../utils/validation';
import { userProfileFieldList } from './data';
import { type AvatarFile, type UserProfileForm } from './typings';

export const UserProfile: FC = () => {
  const dispatch = useAppDispatch();
  const validation = useValidation(userProfileFieldList);

  const userProfile = useAppSelector(authSelectors.userProfile);
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
  const [avatarFile, setAvatarFile] = useState<AvatarFile>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    if (updateResult) {
      updateResult.map(({ type, message }) => {
        toast(message, { type: type });
      });
    }
  }, [updateResult]);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsFormSubmitted(true);
  }, []);

  const onFormSubmitCallback = () => {
    dispatch(profileThunks.updateProfile({ ...formData, avatarFile: avatarFile }));
    setFormData({ ...formData, avatar: '', oldPassword: '', newPassword: '' });
    setAvatarFile(null);
  };

  let avatarPath = AVATAR.defaultPath;
  if (userProfile?.avatar) {
    avatarPath = buildPath(determineBaseUrl(), AVATAR.apiPath, userProfile.avatar);
  }

  const header = userProfile?.first_name;

  return (
    <>
      {generateMetaTags({ title: 'Редактирование профиля' })}
      <div className="user-profile">
        <img src={avatarPath} alt={`Аватар пользователя ${header}`} className="avatar-img avatar-img__big" />

        <Form onSubmitHandler={onFormSubmit} header={header}>
          <FieldList<UserProfileForm>
            setFile={setAvatarFile}
            fieldList={userProfileFieldList}
            isFormSubmitted={isFormSubmitted}
            setIsFormSubmitted={setIsFormSubmitted}
            onFormSubmitCallback={onFormSubmitCallback}
            formData={formData}
            setFormData={setFormData}
            validation={validation}
            disabled={isProfileLoading}
          />
          <div className="form__buttons-wrapper">
            <Button text="Сохранить изменения" type="submit" variant={ButtonVariant.Primary} />
          </div>
        </Form>
      </div>
    </>
  );
};
