export type CreatorProps = {
  creator: Creator;
  githubCreator?: GithubCreator;
};

export type Creator = {
  id: number;
  name: string;
  partOne: string;
  partTwo: string;
  content: string;
};

export type GithubCreator = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
};
