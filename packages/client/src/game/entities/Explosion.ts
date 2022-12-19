import { spriteCoordinates } from '../data/constants';
import type { EntitySettings } from '../typings';
import { Entity } from './';

export class Explosion extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    this.crossable = true;
    this.hittable = false;
    this.color = 'red';

    switch (this.type) {
      case 'projectileExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'tankExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.tankExplosion;
        break;
    }

    this.on('spawn', () => {
      this.startAnimation({
        delay: 0,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });
    });
  }
}
