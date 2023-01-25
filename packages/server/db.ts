import { type SequelizeOptions, Sequelize } from 'sequelize-typescript';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST } = process.env;

export const createClientAndConnect = async (): Promise<Sequelize | null> => {
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

    const client = new Sequelize(sequelizeOptions);

    /** Регистрируем модели */
    client.addModels([__dirname + '/models']);

    /** Для production лучше использовать миграции вместо синхронизации **/
    await client.sync({ alter: true });

    console.log('  ➜ 🎸 Connected to the Postgres database');

    return client;
  } catch (e) {
    console.error(e);
  }

  return null;
};
