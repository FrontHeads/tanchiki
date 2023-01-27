import { type EntityDynamicSettings } from '../EntityDynamic/typings';

export type PlayerVariant = 'PLAYER1' | 'PLAYER2';

export type EnemyVariant = 'BASIC' | 'FAST' | 'POWER' | 'ARMOR';

export type TankEnemySettings = { variant: EnemyVariant } & Partial<EntityDynamicSettings>;
