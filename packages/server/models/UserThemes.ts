import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  Index,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import { Themes } from './Themes';

@Table({
  tableName: 'user_themes',
})
export class UserThemes extends Model {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  theme_id!: number;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.INTEGER)
  user_id!: number;

  @BelongsTo(() => Themes, 'theme_id')
  theme!: Themes;

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
