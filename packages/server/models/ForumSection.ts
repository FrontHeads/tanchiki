import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'forum_section' })
export class ForumSection extends Model {
  @AllowNull(false)
  @Column
  title!: string;
}
