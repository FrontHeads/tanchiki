import { AllowNull, BelongsTo, Column, ForeignKey, Model, NotEmpty, Table } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';
import { User } from './User';

@Table({ tableName: 'forum_messages', createdAt: 'created_at', updatedAt: 'updated_at' })
export class ForumMessage extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id!: number;

  @AllowNull(false)
  @Column
  topic_id!: number;

  @AllowNull(false)
  @NotEmpty({ msg: 'Поле не может быть пустым' })
  @Column
  content!: string;

  @BelongsTo(() => ForumTopic, 'topic_id')
  topic!: ForumTopic;

  @BelongsTo(() => User)
  user!: User;
}
