import './UserProfile.css';

import { useCallback, useState } from 'react';

import { Button } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormField } from '../../components/FormField';
import { PATH } from '../../config/constants';
import { baseInputFields, passwordInputFields, UserProfile as UserProfileType, UserProfileForm } from './typings';

export const UserProfile: React.FC = () => {
  const userProfile: UserProfileType = {
    id: 13441,
    first_name: 'Test',
    second_name: 'FsssTest',
    display_name: 'test',
    login: 'test3',
    avatar: '/5aa5e90f-1cd3-456b-98d1-8d74e9ec44da/20cacda2-60db-49c0-b671-6f2418e8c493_Z8NbK-ghPi4.jpg',
    email: 'test3@test.com',
    phone: '89217466666',
  }; // TODO: replace with the real data

  const formData: UserProfileForm = {
    email: userProfile.email,
    login: userProfile.login,
    first_name: userProfile.first_name,
    second_name: userProfile.second_name,
    display_name: userProfile.display_name,
    phone: userProfile.phone,
    oldPassword: '',
    newPassword: '',
  };
  const [responseBody, setResponseBody] = useState<UserProfileForm>(formData);

  const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    event => {
      const { name, value } = event.target;
      setResponseBody({ ...responseBody, [name]: value });
    },
    [responseBody]
  );

  const submitHandler: React.FormEventHandler<HTMLFormElement> = useCallback(
    event => {
      event.preventDefault();
      console.log(responseBody);
    },
    [responseBody]
  );

  const avatarPath = userProfile.avatar ? PATH.avatarBase + userProfile.avatar : PATH.defaultAvatar;
  const header = userProfile.first_name;

  return (
    <div className="user-profile">
      <img src={avatarPath} alt={`Аватар пользователя ${header}`} className="avatar-img avatar-img__big" />
      <Form handlerSubmit={submitHandler} header={header}>
        <>
          {baseInputFields.map(field => {
            const fieldKey = field.id as keyof UserProfileForm;
            return (
              <FormField {...field} key={field.id} onChange={inputChangeHandler} value={responseBody[fieldKey] || ''} />
            );
          })}
        </>
        
        <h3 className="form__input-header">Если хотите поменять пароль:</h3>
        <>
          {passwordInputFields.map(field => (
            <FormField key={field.id} {...field} onChange={inputChangeHandler} />
          ))}
        </>

        <h3 className="form__input-header">Если хотите поменять аватар:</h3>
        <FormField title={'Фото'} type={'file'} id={'avatar'} onChange={inputChangeHandler} />

        <div className="form__buttons-wrapper">
          <Button text="Сохранить изменения" type="submit" selector="button_primary" />
        </div>
      </Form>
    </div>
  );
};
