export type createTopicRequestData = {
  name: string;
  section_id: number;
  content: string;
};

export type createMessageRequestData = {
  topic_id: number;
  content: string;
};

export type editMessageRequestData = {
  content: string;
};

export type editTopicRequestData = {
  content: string;
};
