import mongoose from 'mongoose';
import * as path from 'path';
import { type SequelizeOptions, Sequelize } from 'sequelize-typescript';

import { ForumSection } from '../models/ForumSection';
import { Themes } from '../models/Themes';

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_HOST,
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB,
} = process.env;

export const initPostgreDBConnection = async (): Promise<Sequelize | undefined> => {
  let client;

  try {
    // Подключаемся к Postgre
    const sequelizeOptions: SequelizeOptions = {
      host: POSTGRES_HOST || 'localhost',
      port: 5432,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      dialect: 'postgres',
      logging: false,
    };

    client = new Sequelize(sequelizeOptions);

    /** Регистрируем модели */
    const modelsPath = path.join(__dirname, '../models');
    client.addModels([modelsPath]);

    //TODO убрать alter на продакшене (при деплое)
    const synced = await client.sync({ alter: true });

    if (synced) {
      console.log('  ➜ 🎸 Synchronized the Postgres database');
      // Добавляем темы по умолчанию в БД при старте сервера, без этого не будет корректно работать темизация.
      await Themes.bulkCreate([{ theme_name: 'DARK' }, { theme_name: 'LIGHT' }], { ignoreDuplicates: true });

      // Добавляем категории форума по умолчанию в БД при старте сервера
      await ForumSection.bulkCreate(
        [{ name: 'Новости' }, { name: 'Вопросы по форуму и игре' }, { name: 'Баги' }, { name: 'Флуд' }],
        { ignoreDuplicates: true }
      );
    }

    console.log('  ➜ 🎸 Connected to the Postgres database');
  } catch (e) {
    console.error(e);
  }

  return client;
};

export const initMongoDBConnection = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DB}`);

    console.log('  ➜ 🎸 Connected to the Mongo database');
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Mongo DB connect error: ${e.message}`);
    } else {
      console.error(e);
    }
  }
};
