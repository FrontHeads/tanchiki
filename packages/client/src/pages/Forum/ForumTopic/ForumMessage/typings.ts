export type ForumMessageT = {
  id: number;
  content: string;
  topic_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
};
export type ForumMessageProps = {
  message: ForumMessageT;
  deleteMessageHandler: (messageId: number) => void;
};

export type User = {
  created_at: string;
  updated_at: string;
  display_name: string;
  id: number;
  login: string;
  avatar: string;
};
