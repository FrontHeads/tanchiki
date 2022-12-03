import type { EntityDynamicSettings } from '../typings';
import { EntityDynamic } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 1;
  moveSpeed = 3;
  moveStepsTotal = 4;
  shouldExplode = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'projectile';
    this.color = 'red';
    this.flying = true;
    this.moving = true;
    this.nextDirection = this.direction;
  }

  moveStepCheck() {
    if (this.shouldExplode) {
      this.shouldBeDestroyed = true;
    }
    if (!this.canMove) {
      this.shouldExplode = true;
    }
  }
}
