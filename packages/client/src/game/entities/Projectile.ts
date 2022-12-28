import { spriteCoordinates } from '../data/constants';
import { Direction, EntityEvent, type ProjectileSettings } from '../typings';
import { EntityDynamic, type Tank } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 1;
  moveSpeed = 2;
  moveStepsTotal = 4;
  exploding = false;
  explosionRadius = 1;
  explosionForce = 1;
  parent: Tank | null = null;

  constructor(props: ProjectileSettings) {
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
    if (this.exploding) {
      this.explode();
    }
    if (!this.canMove) {
      this.exploding = true;
      this.emit(EntityEvent.WILL_DO_DAMAGE, this.calculateExposionRect());
    }
  }

  calculateExposionRect() {
    switch (this.direction) {
      case Direction.UP:
        return {
          posX: this.posX - this.explosionRadius,
          posY: this.posY - this.explosionForce,
          width: this.width + this.explosionRadius * 2,
          height: this.height,
        };
      case Direction.DOWN:
        return {
          posX: this.posX - this.explosionRadius,
          posY: this.posY + this.explosionForce,
          width: this.width + this.explosionRadius * 2,
          height: this.height,
        };
      case Direction.LEFT:
        return {
          posX: this.posX - this.explosionForce,
          posY: this.posY - this.explosionRadius,
          width: this.width,
          height: this.height + this.explosionRadius * 2,
        };
      case Direction.RIGHT:
        return {
          posX: this.posX + this.explosionForce,
          posY: this.posY - this.explosionRadius,
          width: this.width,
          height: this.height + this.explosionRadius * 2,
        };
    }
  }
}
