import { AllowNull, Column, HasMany, Model, Table } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'users' })
export class User extends Model {
  @AllowNull(false)
  @Column
  name!: string;

  @HasMany(() => ForumTopic)
  topics!: ForumTopic[];
}
