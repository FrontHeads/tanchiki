import { type Tank } from '../';
import { type EntityDynamicSettings } from '../EntityDynamic/typings';

export type ProjectileSettings = EntityDynamicSettings & { parent: Tank; explosionForce?: number };
