import type { ProjectileSettings } from '../typings';
import { EntityDynamic, Tank } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 1;
  moveSpeed = 3;
  moveStepsTotal = 4;
  exploding = false;
  explosionRadius = 1;
  parent: Tank | null = null;

  constructor(props: ProjectileSettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'projectile';
    this.color = 'red';
    this.flying = true;
    this.moving = true;
    this.nextDirection = this.direction;
  }

  stateCheck() {
    if (this.exploding) {
      this.explode();
    }
    if (!this.canMove) {
      this.prepareToExplode();
    }
  }

  prepareToExplode() {
    this.exploding = true;

    switch (this.direction) {
      case 'UP':
      case 'DOWN':
        this.posX -= this.explosionRadius;
        this.width += this.explosionRadius * 2;
        break;
      case 'LEFT':
      case 'RIGHT':
        this.posY -= this.explosionRadius;
        this.height += this.explosionRadius * 2;
        break;
    }
  }
}
