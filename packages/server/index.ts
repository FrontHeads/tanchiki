import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { createClientAndConnect } from './db';

dotenv.config();

const app = express();

const clientPort = Number(process.env.CLIENT_PORT) || 3000;
const port = Number(process.env.SERVER_PORT) || 3001;
const corsOptions = {
  credentials: true,
  origin: `http://127.0.0.1:${clientPort}`,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

createClientAndConnect();

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app.listen(port, () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
});
