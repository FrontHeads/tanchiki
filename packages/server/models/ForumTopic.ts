import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'forum_topic' })
export class ForumTopic extends Model {
  @AllowNull(false)
  @Column
  title!: string;

  @AllowNull(false)
  @Column
  author!: string;

  @AllowNull(false)
  @Column
  content!: string;
}
