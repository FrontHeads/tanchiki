import type { Entity, EntityDynamic } from '../entities';

export type GameSettings = {
  width: number;
  height: number;
  root: HTMLElement | null;
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

export type EntitySettings = Pos & Partial<Size> & Partial<Pick<Entity, 'direction' | 'type' | 'role' | 'color'>>;

export type EntityDynamicSettings = EntitySettings & Partial<Pick<EntityDynamic, 'moveSpeed'>>;
