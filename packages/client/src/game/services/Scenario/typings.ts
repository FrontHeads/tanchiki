import { type Tank, type TankEnemy } from '../../entities';
import { type ControllerBase } from '../Controller/ControllerBase';
import { type Player } from './data';

export enum ScenarioEvent {
  GameOver = 'GAME_OVER',
  MissionAccomplished = 'MISSION_ACCOMPLISHED',

  /** Танк игрока размещен на карте (в момент старта игры и респаун после убийства в случае наличия жизни. */
  TankPlayerSpawned = 'TANK_PLAYER_SPAWNED',
  /** Танк игрока был убит */
  TankPlayerDestroyed = 'TANK_PLAYER_DESTROYED',

  /** Вражеский танк размежен на карте. */
  TankEnemySpawned = 'TANK_ENEMY_SPAWNED',
  /** Вражеский танк был убит. */
  TankEnemyDestroyed = 'TANK_ENEMY_DESTROYED',
  /** Попадание снаряда куда-либо. */
  ProjectileHit = 'PROJECTILE_HIT',
}

export type ScenarioState = {
  /**
   * Максимальное количество активных вражеских танков одновременно на карте
   *
   * При игре в одиночку на карте находится не более четырёх танков противника одновременно;
   * при игре вдвоём их не более шести;
   */
  maxActiveEnemies: number;
  /** Всего танков противника на уровне */
  enemiesCounter: number;
  /** Максимальное количество танков противника на уровне */
  maxEnemies: number;
  /** Задержка (мс) перед появлением новых врагов на карте */
  enemiesSpawnDelay: number;
  /** Массив с танами протвников на карте */
  enemies: Tank[];
  /** Объект со state игроков */
  players: Record<Player, ScenarioPlayerState>;
};

export type ScenarioPlayerState = {
  entity?: Tank;
  lives: number;
  controller: ControllerBase;
};

export type EnemyDestroyedPayload = {
  source: Tank;
  destination: TankEnemy;
};
