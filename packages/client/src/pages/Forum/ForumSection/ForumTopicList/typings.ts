import { type ForumMessage } from '../../ForumTopic/ForumMessage/typings';

export type ForumTopicItem = {
  id: number;
  name: string;
  messages: ForumMessage[];
};
export type ForumTopicListProps = {
  topicList: ForumTopicItem[];
  sectionId?: string;
};
