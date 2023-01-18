import { type Color } from '../data/colors';
import { type Projectile } from '../entities';
import { type EntityRole, type EntityType } from '../entities/Entity/typings';
import { type ExplosionVariant } from '../entities/Explosion/typings';
import { type EnemyVariant, type PlayerVariant } from '../entities/Tank/typings';
import { type TerrainVariant } from '../entities/Terrain/typings';

export type GameMode = 'SINGLEPLAYER' | 'MULTIPLAYER';

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type Pos = {
  posX: number;
  posY: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Pos & Size;

export type PosState = { hasCollision: boolean | undefined; nextRect: Rect };

export enum EntityEvent {
  Move = 'MOVE',
  Stop = 'STOP',
  Slide = 'SLIDE',
  Spawn = 'SPAWN',
  Despawn = 'DESPAWN',
  Ready = 'READY',
  Damaged = 'DAMAGED',
  Destroyed = 'DESTROYED',
  Exploding = 'EXPLODING',
  Shoot = 'SHOOT',

  SetLoopDelay = 'SET_LOOP_DELAY',
  SetLoopInterval = 'SET_LOOP_INTERVAL',
  ClearLoopInterval = 'CLEAR_LOOP_INTERVAL',

  WillHaveNewPos = 'ENTITY_WILL_HAVE_NEW_POS',
  WillDoDamage = 'ENTITY_WILL_DO_DAMAGE',
  ShouldBeDestroyed = 'ENTITY_SHOULD_BE_DESTROYED',
  ShouldUpdate = 'ENTITY_SHOULD_UPDATE',
  DidUpdate = 'ENTITY_DID_UPDATE',
  ShouldRenderText = 'ENTITY_SHOULD_RENDER_TEXT',

  AnimationStarted = 'ANIMATION_STARTED',
  AnimationEnded = 'ANIMATION_ENDED',
}

export type EntitySettings = Pos &
  Partial<Size> &
  Partial<{
    direction: Direction;
    type: EntityType;
    //TODO: отрефакторить, чтобы варианты были для конкретных типов
    variant: TerrainVariant | PlayerVariant | EnemyVariant | ExplosionVariant;
    role: EntityRole;
    color: Color | string;
    img: HTMLImageElement;
  }>;

export type EntityDynamicSettings = EntitySettings &
  Partial<{
    moveSpeed: number;
  }>;

export type DamageSettings = Rect & { source: Projectile };

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: Color | string;
    backImg: HTMLImageElement | HTMLCanvasElement;
    mainSpriteCoordinates: SpriteCoordinatesNoAnimations;
    indicatorName?: string;
  }>;

export enum ScreenType {
  Loading = 'LOADING',
  MainMenu = 'MAIN_MENU',
  LevelSelector = 'LEVEL_SELECTOR',
  GameStart = 'GAME_START',
  Pause = 'PAUSE',
  Score = 'SCORE',
  GameOverPopup = 'GAME_OVER_POPUP',
}

export enum Player {
  Player1 = 'PLAYER1',
  Player2 = 'PLAYER2',
}

export type SpriteCoordinatesNoAnimations = null | number[][];
export type SpriteCoordinatesWithAnimations = Record<string, number[][]>;

export type Animations = AnimationSettings[];

export type AnimationSettings = {
  /** Задержка смены кадров. Чем меньше число - тем быстрее анимация.*/
  delay: number;
  /** Координаты спрайта для конкретной анимации. */
  spriteCoordinates: SpriteCoordinatesWithAnimations | SpriteCoordinatesNoAnimations;
  /** Показывать анимацию бесконечно или однократно. False = однократно. */
  looped: boolean;
  /** Показывать ли основной спрайт сущности во время анимации. */
  showMainSprite?: boolean;
  /** Указывает через какой промежуток времени остановить анимацию. */
  stopTimer?: number;
  /** Имя анимации, оно же имя loopInterval который крутит анимацию. */
  name?: string;
  /** Фрейм (кадр) который будет показан при следующем вызове анимации. */
  spriteFrame?: number;
  /** Время последней отрисовки анимации */
  lastTime?: number;
};

export type CancelAnimation =
  /** Убирает анимацию, но спрайт остается видимым. */
  | 'showEntity'
  /** Убирает анимацию и стирает спрайт. */
  | 'eraseEntity';

export type EnemiesKilledState = Record<EnemyVariant, number[]>;
