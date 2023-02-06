import { type UserDTO } from '../api/typings';
import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { type User } from '../pages/Forum/ForumTopic/ForumMessage/typings';
import { type ForumTopicT } from './../pages/Forum/ForumTopic/typings';

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

export const fakeForumSectionData: ForumSectionT = {
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

const fakeUser: User = {
  id: 1,
  avatar: '',
  login: 'user1',
  display_name: 'User display name',
  created_at: '',
  updated_at: '',
};

export const fakeForumTopicData: ForumTopicT = {
  id: 1,
  content: 'Тестовый топик',
  created_at: '',
  messages: [
    {
      content: 'Коммент 1',
      id: 1,
      created_at: '',
      updated_at: '',
      topic_id: 1,
      user_id: 1,
      user: fakeUser,
    },
  ],
  name: 'Топик 1',
  section: fakeForumSectionData,
  section_id: 1,
  updated_at: '',
  user_id: 1,
  user: fakeUser,
  username: 'user1',
};
