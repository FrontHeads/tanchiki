import { AllowNull, Column, DataType, HasMany, Index, Model, Table, Unique } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'forum_sections', createdAt: 'created_at', updatedAt: 'updated_at' })
export class ForumSection extends Model {
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  name!: string;

  @HasMany(() => ForumTopic, 'section_id')
  topics!: ForumTopic[];
}
