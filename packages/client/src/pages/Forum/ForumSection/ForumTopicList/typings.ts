type ForumTopicItem = {
  id: number;
  name: string;
  topicCount: number;
  messages: number;
};
export type ForumTopicListProps = {
  topicList: ForumTopicItem[];
  sectionId?: string;
};
