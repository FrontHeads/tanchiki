import { type BreadcrumbsVariant } from './data';

export type BreadcrumbsItem = {
  href?: string;
  title: string;
};
export type BreadcrumbsProps = {
  data: BreadcrumbsItem[];
  variant: BreadcrumbsVariant;
};
