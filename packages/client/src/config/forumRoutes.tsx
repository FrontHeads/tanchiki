import { Link, Route } from 'react-router-dom';

import { forumAPI } from '../api/forumAPI';
import { Forum } from '../pages/Forum';
import { ForumSection } from '../pages/Forum/ForumSection';
import { ForumNewTopic } from '../pages/Forum/ForumSection/ForumNewTopic';
import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { ForumTopic } from '../pages/Forum/ForumTopic';
import { type ForumTopicT } from '../pages/Forum/ForumTopic/typings';
import { Paths } from './constants';

export const forumRoutes = () => {
  return (
    <>
      <Route index={true} element={<Forum />}></Route>

      <Route path={`${Paths.Section}/:sectionId`}>
        <Route
          index={true}
          element={<ForumSection />}
          loader={async ({ params }) => {
            return forumAPI.getSectionById(Number(params.sectionId));
          }}
          handle={{
            crumb: ({ data }: { data: ForumSectionT }) => <span>{data?.name}</span>,
          }}></Route>
        <Route
          path={`${Paths.Section}/:sectionId/${Paths.Topic}/:topicId`}
          element={<ForumTopic />}
          loader={async ({ params }) => {
            const { data: topicData } = await forumAPI.getTopicById(Number(params.topicId));
            return topicData;
          }}
          handle={{
            crumb: (topicData: ForumTopicT) => {
              const {
                section_id: sectionId,
                name: topicName,
                section: { name: sectionName },
              } = topicData;

              return (
                <>
                  <Link to={`${Paths.Section}/${sectionId}`}>{sectionName}</Link>
                  <span className={'breadcrumbs__item_topic-name'}>{topicName}</span>
                </>
              );
            },
          }}></Route>
        <Route
          path={`${Paths.Section}/:sectionId/${Paths.NewTopic}`}
          element={<ForumNewTopic />}
          loader={async ({ params }) => {
            return forumAPI.getSectionById(Number(params.sectionId));
          }}
          handle={{
            crumb: ({ data }: { data: ForumSectionT }) => (
              <>
                <Link to={`${Paths.Section}/${data.id}`}>{data?.name}</Link>
                <span className={'breadcrumbs__item_topic-name'}>Новая тема</span>
              </>
            ),
          }}></Route>
      </Route>
    </>
  );
};
