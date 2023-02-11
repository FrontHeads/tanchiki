import { type ForumSectionT } from '../ForumSection/typings';
import { type ForumMessageT, type User } from './ForumMessage/typings';

export type ForumTopicT = {
  content: string;
  created_at: string;
  id: number;
  messages: ForumMessageT[];
  name: string;
  section: ForumSectionT;
  section_id: number;
  updated_at: string;
  user_id: number;
  user: User;
  username: string;
};
