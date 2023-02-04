import { AllowNull, BelongsTo, Column, ForeignKey, HasMany, Model, NotEmpty, Table } from 'sequelize-typescript';

import { ForumMessage } from './ForumMessage';
import { ForumSection } from './ForumSection';
import { User } from './User';

@Table({ tableName: 'forum_topics', createdAt: 'created_at', updatedAt: 'updated_at' })
export class ForumTopic extends Model {
  @AllowNull(false)
  @NotEmpty({ msg: 'Поле не может быть пустым' })
  @Column
  name!: string;

  @AllowNull(false)
  @Column
  section_id!: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  user_id!: number;

  @AllowNull(false)
  @NotEmpty({ msg: 'Поле не может быть пустым' })
  @Column
  content!: string;

  @BelongsTo(() => ForumSection, 'section_id')
  section!: ForumSection;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => ForumMessage, 'topic_id')
  messages!: ForumMessage[];
}
