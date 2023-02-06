import { type UserDTO } from '../api/typings';
import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';

export const fakeUserProfile: UserDTO = {
  id: 1,
  display_name: 'User1',
  first_name: 'First Name',
  second_name: 'Second Name',
  email: 'example@mail.com',
  login: 'user1',
  avatar: '',
  phone: '555555',
};

export const fakeSectionData: ForumSectionT = {
  id: 1,
  name: 'Новости',
  topics: [
    {
      id: 1,
      name: 'Топик 1',
      messages: 10,
    },
  ],
};
