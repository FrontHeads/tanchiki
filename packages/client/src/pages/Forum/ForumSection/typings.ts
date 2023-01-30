import { type ForumTopicItem } from './ForumTopicList/typings';

export type ForumSectionT = {
  id: number;
  name: string;
  topics: ForumTopicItem[];
};
