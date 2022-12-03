import type { Entity, EntityDynamic } from '../entities';

export type GameSettings = {
  width: number;
  height: number;
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

export type EntityRole = 'player1' | 'player2' | 'enemy' | 'neutral';

export type EntityType =
  | 'tank'
  | 'flag'
  | 'boundary'
  | 'brickWall'
  | 'concreteWall'
  | 'trees'
  | 'water'
  | 'ice'
  | 'custom';

export type EntitySettings = Pos &
  Partial<Size> &
  Partial<{
    direction: Direction;
    type: EntityType;
    role: EntityRole;
    color: string;
  }>;

export type EntityDynamicSettings = EntitySettings & Partial<Pick<EntityDynamic, 'moveSpeed'>>;

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: string;
  }>;
