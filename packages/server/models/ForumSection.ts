import { AllowNull, Column, HasMany, Model, Table } from 'sequelize-typescript';

import { ForumTopic } from './ForumTopic';

@Table({ tableName: 'forum_sections', createdAt: 'created_at', updatedAt: 'updated_at' })
export class ForumSection extends Model {
  @AllowNull(false)
  @Column
  name!: string;

  @HasMany(() => ForumTopic, 'section_id')
  topics!: ForumTopic[];
}
