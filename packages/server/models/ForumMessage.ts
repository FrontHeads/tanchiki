import { AllowNull, BelongsTo, Column, Model, Table } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'forum_messages', createdAt: 'created_at', updatedAt: 'updated_at' })
export class ForumMessage extends Model {
  @AllowNull(false)
  @Column
  user_id!: number;

  @AllowNull(false)
  @Column
  topic_id!: number;

  @AllowNull(false)
  @Column
  content!: string;

  @BelongsTo(() => ForumTopic, 'topic_id')
  topic!: ForumTopic;
}
