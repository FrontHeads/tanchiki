import './UserProfile.css';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { ButtonVariant } from '../../components/Button/typings';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { PATH } from '../../config/constants';
import { userProfileInputFields } from './data';
import { UserProfileForm } from './typings';
import { appSelectors, authActions, authSelectors, me, useAppDispatch, useAppSelector } from '../../store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appThunks } from '../../store/features/app/appThunks';

export const UserProfile: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, isAuthenticated } = useAppSelector(authSelectors.all);

  const { userProfile, isLoading } = useAppSelector(appSelectors.all);

  const formData: UserProfileForm = {
    email: userProfile?.email ?? '',
    login: userProfile?.login ?? '',
    first_name: userProfile?.first_name ?? '',
    second_name: userProfile?.second_name ?? '',
    display_name: userProfile?.display_name ?? '',
    phone: userProfile?.phone ?? '',
    oldPassword: '',
    newPassword: '',
  };

  const [requestBody, setRequestBody] = useState<UserProfileForm>(formData);

  useEffect(() => {
    if (userProfile) {
      setRequestBody(formData);
    } else {
      dispatch(me());
    }
  }, [userProfile]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(authActions.setError(''));
    }
  }, [error]);

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      console.log(requestBody);
      const { name, value } = event.target;
      setRequestBody({ ...requestBody, [name]: value });
    },
    [requestBody]
  );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Update avatar
      if (event.target instanceof HTMLFormElement) {
        const avatarInput = event.target.querySelector(`#avatar`);
        if (avatarInput instanceof HTMLInputElement && avatarInput.files && avatarInput.files.length) {
          dispatch(appThunks.updateProfileAvatar(avatarInput.files[0]));
        }
      }

      // Update profile
      // if (JSON.stringify(requestBody) !== JSON.stringify()) {
      // }
      console.log('updProfile');
      dispatch(appThunks.updateProfile(requestBody));

      // Update password
      const { oldPassword, newPassword } = requestBody;
      if (oldPassword.length && newPassword.length) {
        dispatch(appThunks.updatePassword({ oldPassword, newPassword }));
      }
    },
    [requestBody]
  );

  const avatarPath = userProfile?.avatar ? PATH.avatarBase + userProfile?.avatar : PATH.defaultAvatar;
  const header = userProfile?.first_name;

  return (
    <div className="user-profile">
      <img src={avatarPath} alt={`Аватар пользователя ${header}`} className="avatar-img avatar-img__big" />

      <Form handlerSubmit={submitHandler} header={header}>
        <>
          {userProfileInputFields.map(field => {
            if ('heading' in field) {
              return (
                <h3 key={field.heading} data-testid="form-input-header" className="form__input-header">
                  {field.heading}
                </h3>
              );
            }

            const fieldKey = field.id as keyof UserProfileForm;
            return (
              <FormField key={field.id} {...field} onChange={inputChangeHandler} value={requestBody[fieldKey] || ''} />
            );
          })}
        </>
        <div className="form__buttons-wrapper">
          <Button text="Сохранить изменения" type="submit" variant={ButtonVariant.Primary} />
        </div>
      </Form>
    </div>
  );
};
