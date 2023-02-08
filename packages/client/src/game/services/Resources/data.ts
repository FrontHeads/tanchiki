import { type AssetPathList } from './typings';

export const timeoutMsg =
  'Не удалось загрузить данные для игры в течение минуты. Загрузка отменена. Попробуйте обновить страницу.';
export const errorMsg = 'Не удалось загрузить данные для игры. Попробуйте обновить страницу.';

// Файлы с ресурсами лежат в папке packages/client/public/assets, а vite копирует их в dist при build
export enum ImagePathList {
  brickBg = '/assets/img/bricks.png',
  classicDesignSprite = '/assets/img/sprite.png',
}

export enum SoundPathList {
  levelIntro = '/assets/sounds/level-intro.mp3',
  gameOver = '/assets/sounds/game-over.mp3',
  pause = '/assets/sounds/pause.mp3',
  move = '/assets/sounds/tank-move.mp3',
  idle = '/assets/sounds/tank-idle.mp3',
  ice = '/assets/sounds/ice.mp3',
  shoot = '/assets/sounds/shoot.mp3',
  hitEnemy = '/assets/sounds/hit-enemy.mp3',
  hitBrick = '/assets/sounds/hit-brick.mp3',
  hitSteel = '/assets/sounds/hit-steel.mp3',
  playerExplosion = '/assets/sounds/player-explosion.mp3',
  enemyExplosion = '/assets/sounds/enemy-explosion.mp3',
  powerupAppear = '/assets/sounds/powerup-appear.mp3',
  powerupPickup = '/assets/sounds/powerup-pickup.mp3',
  lifePickup = '/assets/sounds/life.mp3',
  // Нужны два одинаковых звука, иначе из-за быстрого проигрывания происходят искажения
  score = '/assets/sounds/score.mp3',
  score2 = '/assets/sounds/score.mp3',
}

export const assetPathList: AssetPathList = { ...ImagePathList, ...SoundPathList };

export const extensionList = {
  images: ['png', 'svg', 'jpg', 'jpeg', 'gif'],
  sounds: ['mp3'],
};
