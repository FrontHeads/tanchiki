import { type ForumTopicItem } from './ForumTopicList/typings';

export type ForumSectionT = {
  id: number;
  name: string;
  topics: ForumTopicItem[];
} | null;

// export type ForumSectionProps = {
//   section: ForumSectionT;
// };
