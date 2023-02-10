import { AsyncLocalStorage } from 'async_hooks';
import type { RequestHandler } from 'http-proxy-middleware';

const asyncLocalStorage = new AsyncLocalStorage();

const requestDataSaverMiddleware: RequestHandler = async (req, _res, next) => {
  const map = new Map();
  map.set('userCookies', req.headers['cookie']);
  asyncLocalStorage.run(map, () => next());
};

export { asyncLocalStorage, requestDataSaverMiddleware };
