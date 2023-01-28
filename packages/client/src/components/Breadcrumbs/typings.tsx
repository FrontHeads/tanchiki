import { type ForumSectionT } from '../../pages/Forum/ForumSection/typings';
import { type BreadcrumbsVariant } from './data';

export type BreadcrumbsItem = {
  href?: string;
  title: string;
};
export type BreadcrumbsProps = {
  data: BreadcrumbsItem[];
  variant: BreadcrumbsVariant;
};

export type TopicBreadcrumb = { params: { sectionId: number; topicId: number }; section: { data: ForumSectionT } };
