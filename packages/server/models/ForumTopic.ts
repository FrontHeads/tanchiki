import { AllowNull, BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';

import { ForumMessage } from './ForumMessage';
import { ForumSection } from './ForumSection';
import { User } from './User';

@Table({ tableName: 'forum_topics', createdAt: 'created_at', updatedAt: 'updated_at' })
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
  user!: ForumSection;

  @HasMany(() => ForumMessage, 'topic_id')
  messages!: ForumMessage[];
}