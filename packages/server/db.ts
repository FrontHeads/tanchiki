import mongoose from 'mongoose';
import { type SequelizeOptions, Sequelize } from 'sequelize-typescript';

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

export const createClientAndConnect = async (): Promise<Sequelize | undefined> => {
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
    client.addModels([__dirname + '/models']);

    /** Для production лучше использовать миграции вместо синхронизации **/
    await client.sync({ alter: true });

    console.log('  ➜ 🎸 Connected to the Postgres database');
  } catch (e) {
    console.error(e);
  }

  // Подключаемся к MongoDB
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

  return client;
};
