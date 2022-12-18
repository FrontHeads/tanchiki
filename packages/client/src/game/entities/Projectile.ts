import { spriteCoordinates } from '../data/constants';
import type { EntityDynamicSettings } from '../typings';
import { EntityDynamic } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 1;
  moveSpeed = 3;
  moveStepsTotal = 4;

  constructor(props: EntityDynamicSettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'projectile';
    this.color = 'red';
    this.mainSpriteCoordinates = spriteCoordinates.projectile;
    this.flying = true;
    this.moving = true;
    this.nextDirection = this.direction;
  }

  stateCheck() {
    if (!this.canMove) {
      this.stop();
      this.explode();
    }
  }
}
