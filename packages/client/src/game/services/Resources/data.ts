import { AssetsDataList } from './typings';

export const timeoutMsg =
  'Не удалось загрузить данные для игры в течение минуты. Загрузка отменена. Попробуйте обновить страницу.';
export const errorMsg = 'Не удалось загрузить данные для игры. Попробуйте обновить страницу.';

export const imagesData = {
  sprite: {
    type: 'image',
    path: '../src/game/assets/img/sprite.png',
  },
};

export const soundsData = {
  enemyExplosion: {
    type: 'sound',
    path: '../src/game/assets/sounds/enemy-explosion.mp3',
  },
  fire: {
    type: 'sound',
    path: '../src/game/assets/sounds/fire.mp3',
  },
};

export const assetsData: AssetsDataList = { ...imagesData, ...soundsData };
