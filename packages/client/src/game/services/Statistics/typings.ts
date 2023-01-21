import { type EnemyVariant } from '../../entities/Tank/typings';

export type EnemiesKilledState = Record<EnemyVariant, number[]>;

export type StatisticsData = {
  score: number;
  matches: number;
  time: number;
};
