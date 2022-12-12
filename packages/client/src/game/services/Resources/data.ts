import { AssetPathList } from './typings';

export const timeoutMsg =
  'Не удалось загрузить данные для игры в течение минуты. Загрузка отменена. Попробуйте обновить страницу.';
export const errorMsg = 'Не удалось загрузить данные для игры. Попробуйте обновить страницу.';

// Файлы с ресурсами лежат в папке packages/client/public/assets, а vite копирует их в dist при build
export enum ImagePathList {
  brickBg = '/assets/img/bricks.png',
  sprite = '/assets/img/sprite.png',
}

export enum SoundPathList {
  enemyExplosion = '/assets/sounds/enemy-explosion.mp3',
  shoot = '/assets/sounds/shoot.mp3',
}

export const assetPathList: AssetPathList = { ...ImagePathList, ...SoundPathList };

export const extensionList = {
  images: ['png', 'svg', 'jpg', 'jpeg', 'gif'],
  sounds: ['mp3'],
};
