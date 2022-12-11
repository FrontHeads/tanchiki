export const timeoutMsg =
  'Не удалось загрузить данные для игры в течение минуты. Загрузка отменена. Попробуйте обновить страницу.';
export const errorMsg = 'Не удалось загрузить данные для игры. Попробуйте обновить страницу.';

export enum ImageDataList {
  brickBg = '../src/assets/img/bricks.png',
  sprite = '../src/game/assets/img/sprite.png',
}

export enum SoundDataList {
  enemyExplosion = '../src/game/assets/sounds/enemy-explosion.mp3',
  shoot = '../src/game/assets/sounds/shoot.mp3',
}

export const assetDataList = { ...ImageDataList, ...SoundDataList };
