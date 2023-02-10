import { Color } from '../../services/View/colors';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { type Tank, EntityDynamic } from '../';
import { Direction, EntityEvent } from '../Entity/typings';
import { type ProjectileSettings } from './typings';

export class Projectile extends EntityDynamic {
  width = 2;
  height = 2;
  movePace = 2;
  moveSpeed = 1;
  moveSpeedPrev = 1;
  moveStepsTotal = 5;
  /** Радиус взрыва снаряда (прибавляется к размеру). */
  explosionRadius = 1;
  /** Глубина взрыва снаряда. */
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

    this.registerProjectileEvents();
  }

  registerProjectileEvents() {
    this.on(EntityEvent.Damaged, () => {
      this.explode();
    });
  }

  explode() {
    super.explode();
    this.emit(EntityEvent.WillDoDamage, this.calculateExplosionRect());
  }

  stateCheck() {
    if (!this.canMove) {
      if (this.movePace === 2) {
        // Чтобы снаряд правильно определил место взрыва на следующем ходе
        this.movePace = 1;
        this.moveSpeedPrev = this.moveSpeed;
        this.moveSpeed = this.moveStepsTotal - 1;
        this.canMove = true;
        this.moveStepsProgress = 0;
      } else {
        this.explode();
      }
    } else if (this.movePace === 1) {
      // Если цель успела уехать, то нужно вернуть снаряду прежний темп хода
      this.movePace = 2;
      this.moveSpeed = this.moveSpeedPrev;
    }
  }

  calculateExplosionRect() {
    switch (this.direction) {
      case Direction.Up:
        return {
          posX: this.posX - this.explosionRadius,
          posY: this.posY - this.explosionForce,
          width: this.width + this.explosionRadius * 2,
          height: this.height,
        };
      case Direction.Down:
        return {
          posX: this.posX - this.explosionRadius,
          posY: this.posY + this.explosionForce,
          width: this.width + this.explosionRadius * 2,
          height: this.height,
        };
      case Direction.Left:
        return {
          posX: this.posX - this.explosionForce,
          posY: this.posY - this.explosionRadius,
          width: this.width,
          height: this.height + this.explosionRadius * 2,
        };
      case Direction.Right:
        return {
          posX: this.posX + this.explosionForce,
          posY: this.posY - this.explosionRadius,
          width: this.width,
          height: this.height + this.explosionRadius * 2,
        };
    }
  }
}
