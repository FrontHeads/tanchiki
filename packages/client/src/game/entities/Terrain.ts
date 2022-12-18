import { spriteCoordinates } from '../data/constants';
import type { EntitySettings } from '../typings';
import { Entity } from './';

export class Terrain extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    switch (this.type) {
      case 'boundary':
        this.crossable = false;
        this.hittable = true;
        this.color = 'grey';
        break;
      case 'brickWall':
        this.crossable = false;
        this.hittable = true;
        this.color = 'brown';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.brick'];
        break;
      case 'concreteWall':
        this.crossable = false;
        this.hittable = true;
        this.color = 'lightgrey';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.concrete'];
        break;
      case 'trees':
        this.crossable = true;
        this.hittable = false;
        this.color = 'green';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.trees'];
        break;
      case 'water':
        this.crossable = false;
        this.hittable = false;
        this.color = 'blue';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.water'];
        break;
    }

    if (this.type === 'water') {
      this.on('spawn', () => {
        this.startAnimation({
          delay: 350,
          spriteCoordinates: spriteCoordinates['terrain.water'],
          looped: true,
        });
      });
    }
  }
}
