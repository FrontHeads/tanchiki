import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  HasMany,
  Index,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import { UserThemes } from './UserThemes';

@Table({
  tableName: 'themes',
})
export class Themes extends Model {
  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  theme_name!: string;

  @HasMany(() => UserThemes, 'id')
  user_themes!: UserThemes;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deleted_at!: Date;
}
