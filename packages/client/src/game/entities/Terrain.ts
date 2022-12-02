import type { EntitySettings } from '../typings';
import { Entity } from './';

export class Terrain extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    switch (this.type) {
      case 'brickWall':
        this.crossable = false;
        this.hittable = true;
        this.color = 'brown';
        break;
      case 'trees':
        this.crossable = true;
        this.hittable = false;
        this.color = 'green';
        break;
      case 'water':
        this.crossable = false;
        this.hittable = false;
        this.color = 'blue';
        break;
    }
  }
}
