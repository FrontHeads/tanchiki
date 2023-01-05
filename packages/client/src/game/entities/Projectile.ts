import { Color, spriteCoordinates } from '../data/constants';
import { type ProjectileSettings, Direction, EntityEvent } from '../typings';
import { type Tank, EntityDynamic } from './';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 2;
  moveSpeed = 1;
  moveStepsTotal = 5;
  exploding = false;
  explosionRadius = 1;
  explosionForce = 1;
  parent: Tank | null = null;

  constructor(props: ProjectileSettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'projectile';
    this.color = Color.Red;
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
      if (this.movePace === 2) {
        // Чтобы снаряд правильно определил место взрыва на следующем ходе
        this.movePace = 1;
        this.canMove = true;
        this.moveStepsProgress = 0;
      } else {
        this.exploding = true;
        this.emit(EntityEvent.WILL_DO_DAMAGE, this.calculateExplosionRect());
      }
    } else if (this.movePace === 1) {
      // Если цель успела уехать, то нужно вернуть снаряду прежний темп хода
      this.movePace = 2;
    }
  }

  calculateExplosionRect() {
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
