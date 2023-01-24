import { AllowNull, BelongsTo, Column, Model, Table } from 'sequelize-typescript';

import { ForumSection } from './ForumSection';
import { User } from './User';

@Table({ tableName: 'forum_topics' })
export class ForumTopic extends Model {
  @AllowNull(false)
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  section_id!: number;

  @AllowNull(false)
  @Column
  user_id!: number;

  @AllowNull(false)
  @Column
  content!: string;

  @BelongsTo(() => ForumSection, 'section_id')
  section!: ForumSection;

  @BelongsTo(() => User, 'user_id')
  user!: User;
}
