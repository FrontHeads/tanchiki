type ForumSectionItem = {
  id: number;
  name: string;
  topicCount: number;
  messages: number;
};
export type ForumSectionListProps = {
  sectionList: ForumSectionItem[];
};
