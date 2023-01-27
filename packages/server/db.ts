import { type SequelizeOptions, Sequelize } from 'sequelize-typescript';

import { Themes } from './models/Themes';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST } = process.env;

export const createClientAndConnect = async (): Promise<Sequelize | null> => {
  try {
    const sequelizeOptions: SequelizeOptions = {
      host: POSTGRES_HOST || 'localhost',
      port: 5432,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      dialect: 'postgres',
      logging: false,
    };

    const client = new Sequelize(sequelizeOptions);

    /** Регистрируем модели */
    client.addModels([__dirname + '/models']);

    //TODO убрать alter на продакшене (при деплое)
    const synced = await client.sync({ alter: true });

    if (synced) {
      console.log('  ➜ 🎸 Synchronized the Postgres database');
      // Добавляем темы по умолчанию, без них не будет работать темизация
      await Themes.upsert({ theme_name: 'DARK' });
      await Themes.upsert({ theme_name: 'LIGHT' });
    }

    console.log('  ➜ 🎸 Connected to the Postgres database');

    return client;
  } catch (e) {
    console.error(e);
  }

  return null;
};
