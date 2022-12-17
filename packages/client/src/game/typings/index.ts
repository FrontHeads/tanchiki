import { Tank } from '../entities';
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

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: string;
    backImg: HTMLImageElement;
    spriteCoordinates: SpriteCoordinatesNoAnimations;
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

  /** Танк игрока размещен на карте (в момент старта игры и респаун после убийства в случае наличия жизни */
  TANK_PLAYER_SPAWNED = 'tank_player_spawned',
  /** Танк игрока был убит */
  TANK_PLAYER_DESTROYED = 'tank_player_destroyed',

  /** Вражеский танк размежен на карте */
  TANK_ENEMY_SPAWNED = 'tank_enemy_spawned',
  /** Вражеский танк был убит */
  TANK_ENEMY_DESTROYED = 'tank_enemy_destroyed',
  /** Вражеский танк был убит */
  PROJECTILE_HIT = 'projectile_hit',
}

export type ScenarioState = {
  maxActiveEnemies: number;
  enemiesLeft: number;
  enemies: Tank[];
  players: Record<Player, ScenarioPlayerState>;
};

export type ScenarioPlayerState = {
  entity?: Tank;
  stat: ScenarioStat;
  lives: number;
  controller: Controller;
};

export type ScenarioStat = Record<TankEnemyType, number>;

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

export type LoopDelays = Record<number, Set<() => void>>;

export type LoopIntervals = Record<string, LoopInterval>;

export type LoopInterval = {
  loopCounter: number;
  workLoop: number;
  callback: () => void;
};

export type SpriteCoordinatesNoAnimations = null | number[][];
export type SpriteCoordinatesWithAnimations = Record<string, number[][]>;

export type Animations = AnimationSettings[];

export type AnimationSettings = {
  /** Скорость смены кадров */
  delay: number;
  /** Координаты спрайта для конкретной анимации */
  spriteCoordinates: SpriteCoordinatesWithAnimations | SpriteCoordinatesNoAnimations;
  /** Показывать анимацию бесконечно или однократно. False = однократно. */
  looped: boolean;
  /** Имя анимации, оно же имя loopInterval который крутит анимацию */
  name?: string | number;
  /** Фрейм (кадр) который будет показан при следующем вызове анимации */
  spriteFrame?: number;
  /** Чтобы поставить анимацию анимацию нужно установить false. */
  //TODO пока не реализовано.
  isPlay?: boolean;
};

export type CancelAnimation = 'showEntity' | 'eraseEntity' | 'deleteEntity';
