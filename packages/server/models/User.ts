import { AllowNull, Column, DataType, HasMany, Index, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

import { ForumMessage } from './ForumMessage';
import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class User extends Model {
  @AllowNull(false)
  @Unique
  @Index
  @PrimaryKey
  @Column(DataType.INTEGER)
  ya_id!: number;

  @AllowNull(false)
  @Column
  login!: string;

  @Column
  display_name!: string;

  @HasMany(() => ForumTopic)
  topics!: ForumTopic[];

  @HasMany(() => ForumMessage)
  messages!: ForumMessage[];
}
