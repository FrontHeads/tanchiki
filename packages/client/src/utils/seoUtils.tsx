import { Helmet } from 'react-helmet';

import { META_TITLE_SUFFIX } from './../config/constants';
type GenerateMetaTagsOptions = {
  title: string;
  description?: string;
};

export const generateMetaTags = (options: GenerateMetaTagsOptions) => {
  return (
    <Helmet>
      <title>
        {options.title} {META_TITLE_SUFFIX}
      </title>
      {options.description ? <meta name="description" content={options.description} /> : null}
    </Helmet>
  );
};
