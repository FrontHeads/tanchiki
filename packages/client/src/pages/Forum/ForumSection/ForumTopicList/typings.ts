export type ForumTopicItem = {
  id: number;
  name: string;
  messages: number;
};
export type ForumTopicListProps = {
  topicList: ForumTopicItem[];
  sectionId?: string;
};
