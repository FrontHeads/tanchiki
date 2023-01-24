import { AllowNull, BelongsTo, Column, Model, Table } from 'sequelize-typescript';

import { ForumSection } from './ForumSection';

@Table({ tableName: 'forum_topics', createdAt: 'created_date', updatedAt: 'updated_date' })
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
  username!: string;

  @AllowNull(false)
  @Column
  content!: string;

  @BelongsTo(() => ForumSection, 'section_id')
  section!: ForumSection;
}
