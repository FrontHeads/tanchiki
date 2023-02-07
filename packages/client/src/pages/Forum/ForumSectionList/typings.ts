export type ForumSectionItem = {
  id: number;
  name: string;
  topicCount: number;
  messages: number;
  created_at: string;
  updated_at: string;
};
export type ForumSectionListProps = {
  sectionList: ForumSectionItem[];
};
