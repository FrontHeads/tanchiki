import { Link, Route } from 'react-router-dom';

import { forumAPI } from '../api/forumAPI';
import { type TopicBreadcrumb } from '../components/Breadcrumbs/typings';
import { Forum } from '../pages/Forum';
import { ForumSection } from '../pages/Forum/ForumSection';
import { ForumNewTopic } from '../pages/Forum/ForumSection/ForumNewTopic';
import { type ForumSectionT } from '../pages/Forum/ForumSection/typings';
import { ForumTopic } from '../pages/Forum/ForumTopic';
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
          // path={`${Paths.Section}/:sectionId/topic/:topicId`}
          element={<ForumTopic />}
          loader={async ({ params }) => {
            // const section = await forumAPI.getSectionById(Number(params.sectionId));
            const { data: topicData } = await forumAPI.getTopicById(Number(params.topicId));
            //TODO: убрать парамс v
            return { params, topicData };
          }}
          handle={{
            //TODO: убрать парамс
            crumb: ({ params, topicData }: TopicBreadcrumb) => {
              const { sectionId } = params;
              console.log(topicData);

              // const [{ name: topicName }] = data.topics.filter(topic => topic.id === Number(topicId));

              return (
                <>
                  <Link to={`${Paths.Section}/${sectionId}`}>{topicData.section.name}</Link>
                  <span>{topicData.name}</span>
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
                <span>Новая тема</span>
              </>
            ),
          }}></Route>
      </Route>
    </>
  );
};
