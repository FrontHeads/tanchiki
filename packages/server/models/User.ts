import { AllowNull, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { ForumMessage } from './ForumMessage';
import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class User extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  ya_id!: number;

  @AllowNull(false)
  @Column
  login!: string;

  @Column
  display_name!: string;

  @Column
  avatar!: string;

  @HasMany(() => ForumTopic)
  topics!: ForumTopic[];

  @HasMany(() => ForumMessage)
  messages!: ForumMessage[];
}
