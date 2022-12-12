export enum BreadcrumbsVariant {
  Wide = 'wide',
  Normal = 'normal',
}

export type BreadcrumbsItem = {
  href?: string;
  title: string;
};
export type BreadcrumbsProps = {
  data: BreadcrumbsItem[];
  variant: BreadcrumbsVariant;
};
