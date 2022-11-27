import { EntityDynamic, Tank } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 1;
  moveSpeed = 4;
  moveStepsTotal = 4;
  shouldExplode = false;

  constructor(props: Partial<EntityDynamic> & Pick<Tank, 'shootSpeed' | 'direction'>) {
    super(props);
    this.color = 'red';
    this.moveSpeed = props.shootSpeed;
    this.flying = true;
    this.moving = true;
    this.nextDirection = props.direction;
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
