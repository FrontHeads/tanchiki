import { type ForumSectionT } from '../ForumSection/typings';
import { type ForumMessage, type User } from './ForumMessage/typings';

export type ForumTopicT = {
  content: string;
  created_at: string;
  id: number;
  messages: ForumMessage[];
  name: string;
  section: ForumSectionT;
  section_id: number;
  updated_at: string;
  user_id: number;
  user: User;
  username: string;
};
