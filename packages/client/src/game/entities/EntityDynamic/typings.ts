import { type EntitySettings } from '../Entity/typings';

export type EntityDynamicSettings = EntitySettings &
  Partial<{
    moveSpeed: number;
  }>;
