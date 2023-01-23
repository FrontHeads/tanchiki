import { type Color } from '../../services/View/colors';
import { type ExplosionVariant } from '../Explosion/typings';
import { type Projectile } from '../Projectile/Projectile';
import { type EnemyVariant, type PlayerVariant } from '../Tank/typings';
import { type TerrainVariant } from '../Terrain/typings';

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
  | 'explosion'
  | 'score'
  | 'indicator'
  | 'custom';

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

export type DamageSettings = Rect & { source: Projectile };
