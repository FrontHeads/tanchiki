import { Entity, Tank, TankEnemy } from '../entities';
import { Controller } from './../services/Controller';

export type GameSettings = {
  width: number;
  height: number;
  boundarySize: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
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

export type EntityRole = 'player' | 'enemy' | 'neutral';

export type EntityType =
  | 'tank'
  | 'projectile'
  | 'flag'
  | 'boundary'
  | 'brickWall'
  | 'concreteWall'
  | 'trees'
  | 'water'
  | 'ice'
  | 'powerup'
  | 'projectileExplosion'
  | 'tankExplosion'
  | 'custom';

export type EntitySettings = Pos &
  Partial<Size> &
  Partial<{
    direction: Direction;
    type: EntityType;
    role: EntityRole;
    color: string;
    img: HTMLImageElement;
  }>;

export type EntityDynamicSettings = EntitySettings &
  Partial<{
    moveSpeed: number;
  }>;

export type ProjectileSettings = EntityDynamicSettings & { parent: Tank };

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: string;
    backImg: HTMLImageElement;
    mainSpriteCoordinates: SpriteCoordinatesNoAnimations;
  }>;

export enum MainMenuState {
  SINGLEPLAYER,
  MULTIPLAYER,
}

export enum ScreenType {
  MAIN_MENU,
  LOADING,
  LEVEL_SELECTOR,
  GAME_OVER,
  GAME,
}

// Scenario
export enum Player {
  PLAYER1,
  PLAYER2,
}

export enum TankEnemyType {
  BASIC,
  FAST,
  POWER,
  ARMOR,
}

export enum ScenarioEvent {
  GAME_OVER = 'game_over',
  MISSION_ACCOMPLISHED = 'mission_accomplished',

  /** Танк игрока размещен на карте (в момент старта игры и респаун после убийства в случае наличия жизни. */
  TANK_PLAYER_SPAWNED = 'tank_player_spawned',
  /** Танк игрока был убит */
  TANK_PLAYER_DESTROYED = 'tank_player_destroyed',

  /** Вражеский танк размежен на карте. */
  TANK_ENEMY_SPAWNED = 'tank_enemy_spawned',
  /** Вражеский танк был убит. */
  TANK_ENEMY_DESTROYED = 'tank_enemy_destroyed',
  /** Попадание снаряда куда-либо. */
  PROJECTILE_HIT = 'projectile_hit',
}

export type ScenarioState = {
  /**
   * Максимальное количество активных вражеских танков одновременно на карте
   *
   * При игре в одиночку на карте находится не более четырёх танков противника одновременно;
   * при игре вдвоём их не более шести;
   */
  maxActiveEnemies: number;
  /** Всего же танков противника на уровне */
  enemiesLeft: number;
  /** Массив с танами протвников на карте */
  enemies: Tank[];
  /** Объект со state игроков */
  players: Record<Player, ScenarioPlayerState>;
};

export type ScenarioPlayerState = {
  entity?: Tank;
  statistics: ScenarioStat;
  lives: number;
  controller: Controller;
};

export type ScenarioStat = Record<TankEnemyType, number>;

export type EnemyDestroyedPayload = {
  source: Tank;
  destination: TankEnemy;
};

export type MapData = TupleArray<TupleArray<number, 13>, 13>;

export enum Cell {
  BLANK = 0,
  FOREST = 11,
  ICE = 12,
  WATER = 13,
  BASE = 15,

  BRICK = 1,
  BRICK_TOP = 2,
  BRICK_RIGHT = 3,
  BRICK_BOTTOM = 4,
  BRICK_LEFT = 5,
  BRICK_LEFT_BOTTOM = 17,
  BRICK_RIGHT_BOTTOM = 18,

  CONCRETE = 6,
  CONCRETE_TOP = 7,
  CONCRETE_RIGHT = 8,
  CONCRETE_BOTTOM = 9,
  CONCRETE_LEFT = 10,
  CONCRETE_LEFT_BOTTOM = 19,
  CONCRETE_RIGHT_BOTTOM = 20,
}

export type LoopDelays = Record<number, Array<() => void>>;

export type LoopIntervals = Record<string, LoopInterval>;

export type LoopInterval = {
  loopCounter: number;
  targetLoop: number;
  callback: () => void;
};

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
  /** Чтобы поставить анимацию на паузу нужно установить false. */
  //TODO пока не реализовано.
  isPlay?: boolean;
};

export type CancelAnimation =
  /** Убирает анимацию, но спрайт остается видимым. */
  | 'showEntity'
  /** Убирает анимацию и стирает спрайт. */
  | 'eraseEntity'
  /** Убирает анимацию и удаляет сущность. */
  | 'deleteEntity';

/** Список canvas-слоев и прикрепленных к ним сущностей. */
export type LayerList = Record<
  string,
  {
    context: CanvasRenderingContext2D;
    entities: Set<LayerEntity>;
  }
>;

/** Типизирует сущности привязанные к слою и обязывает хранить все свойства и listeners сущностей */
export type LayerEntity = {
  instance: Entity;
  listeners: Record<string, (...args: Array<any>) => void>;
};

export type GetSpriteCoordinates = {
  entity: Entity;
  animation?: AnimationSettings;
};
