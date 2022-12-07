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

export type EntityRole = 'player1' | 'player2' | 'enemy' | 'neutral';

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
