import type { EntitySettings } from '../typings';
import { Entity } from './';

export class Flag extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'flag';
    this.color = 'white';
    this.crossable = false;
    this.hittable = true;
  }
}
