import { AllowNull, Column, DataType, HasMany, Index, Model, Table, Unique } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'users', createdAt: 'created_at', updatedAt: 'updated_at' })
export class User extends Model {
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.INTEGER)
  user_id!: number;

  @AllowNull(false)
  @Column
  login!: string;

  @Column
  display_name!: string;

  @HasMany(() => ForumTopic, 'user_id')
  topics!: ForumTopic[];
}
