import { type EntityDynamicSettings } from '../../typings';
import { type Tank } from '../Tank/Tank';

export type ProjectileSettings = EntityDynamicSettings & { parent: Tank };
