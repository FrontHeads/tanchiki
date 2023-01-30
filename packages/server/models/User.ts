import { AllowNull, Column, DataType, HasMany, Index, Model, Table, Unique } from 'sequelize-typescript';

import { ForumMessage } from './ForumMessage';
import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class User extends Model {
  @AllowNull(false)
  @Column
  login!: string;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.INTEGER)
  user_id!: number;

  @Column
  display_name!: string;

  @HasMany(() => ForumTopic, 'user_id')
  topics!: ForumTopic[];

  @HasMany(() => ForumMessage, 'user_id')
  messages!: ForumMessage[];
}
