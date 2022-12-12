type ForumMessage = {
  id: number;
  content: string;
  date: string;
  userId: number;
  username: string;
};
export type ForumMessageProps = {
  message: ForumMessage;
};
