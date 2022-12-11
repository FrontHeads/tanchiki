import { Tank } from '../entities';

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

export type PosState = { hasCollision: boolean };

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
    img: HTMLImageElement;
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
}

export type ScenarioStat = Record<TankEnemyType, number>;

export type ScenarioState = {
  entity: Tank;
  lives: number;
  stat: ScenarioStat;
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
