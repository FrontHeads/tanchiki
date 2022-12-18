import { spriteCoordinates } from '../data/constants';
import type { EntitySettings } from '../typings';
import { Entity } from './';

export class Explosion extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    switch (this.type) {
      case 'projectileExplosion':
        this.crossable = true;
        this.hittable = false;
        this.color = 'red';
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'tankExplosion':
        this.crossable = true;
        this.hittable = false;
        this.color = 'red';
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
    }

    if (this.type === 'projectileExplosion' || this.type === 'tankExplosion') {
      const coordinateSelector = this.type;
      const ms = this.type === 'projectileExplosion' ? 0 : 25;

      this.on('spawn', () => {
        this.startAnimation({
          delay: ms,
          spriteCoordinates: spriteCoordinates[coordinateSelector],
          looped: false,
        });
      });
    }
  }
}
