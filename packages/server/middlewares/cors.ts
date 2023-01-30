import cors from 'cors';

export const corsMiddleware = () => {
  const clientPort = Number(process.env.CLIENT_PORT) || 3000;
  /** Настройка CORS для корректной отдчаи проекта на клиентском порту при локальной разработке */
  const corsOptions = {
    credentials: true,
    origin: [`http://127.0.0.1:${clientPort}`, `http://localhost:${clientPort}`],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  return cors(corsOptions);
};
