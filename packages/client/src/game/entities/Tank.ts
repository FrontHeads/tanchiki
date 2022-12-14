import { Color } from '../data/colors';
import { spriteCoordinates } from '../data/constants';
import { type EntityDynamicSettings, Direction, EntityEvent, Speed } from '../typings';
import { EntityDynamic, Projectile } from './';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  movePace = 2;
  moveSpeed = 3;
  moveStepsTotal = 12;
  shootSpeed = 2;
  spawnTimeout = 1000;
  canShoot = false;
  shooting = false;
  /** Временно блокирует возможность перемещения (например на время анимации спауна). */
  frozen = true;
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = false;
  /** Заносит ли объект на льду */
  sliding = false;
  /** Сколько циклов объект пробыл в заносе */
  slidingStepsProgress = 0;
  /** На сколько циклов объект должно заносить */
  slidingStepsTotal = 20;

  constructor(props: EntityDynamicSettings) {
    super({ ...props, type: 'tank' });
    Object.assign(this, props);
    this.color = props.color || Color.Yellow;

    this.registerTankEvents();
  }

  registerTankEvents() {
    this.on(EntityEvent.SPAWN, () => {
      this.startAnimation({
        delay: 50,
        spriteCoordinates: spriteCoordinates.spawn,
        looped: true,
        stopTimer: this.spawnTimeout,
      });

      const color = this.color;
      this.color = Color.LightCyan;
      // Чтобы снаряды пролетали через спавнящийся танк (отображается в виде звезды)
      this.hittable = false;
      // Возвращаем танку подвижность после анимации спауна.
      this.setLoopDelay(() => {
        this.frozen = false;
        this.canShoot = true;
        this.hittable = true;
        this.color = color;
        this.emit(EntityEvent.READY);
      }, this.spawnTimeout);
    });

    this.on(EntityEvent.DAMAGED, ({ source }) => {
      if (!this.invincible && this.role !== source.role) {
        this.explode();
        this.destroyedBy = source;
        this.emit(EntityEvent.DESTROYED, source);
      }
    });
  }

  setMoveSpeed(speed: Speed) {
    switch (speed) {
      case Speed.Low:
        this.moveSpeed = 0;
        break;
      case Speed.Medium:
        this.moveSpeed = 3;
        break;
      case Speed.High:
        this.moveSpeed = 6;
        break;
    }
  }

  setShootSpeed(speed: Speed) {
    switch (speed) {
      case Speed.Low:
        this.shootSpeed = 1;
        break;
      case Speed.Medium:
        this.shootSpeed = 2;
        break;
      case Speed.High:
        this.shootSpeed = 3;
        break;
    }
  }

  shoot() {
    if (!this.spawned || !this.canShoot) {
      return;
    }

    this.shooting = true;
    this.canShoot = false;
  }

  stateCheck() {
    if (this.sliding) {
      if (!this.canMove || ++this.slidingStepsProgress > this.slidingStepsTotal) {
        this.sliding = false;
      } else {
        this.stopping = true;
      }
    }

    if (!this.shooting) {
      return;
    }

    const projectile = new Projectile({
      parent: this,
      ...this.calculateProjectileInitPos(),
      role: this.role,
      direction: this.direction,
      moveSpeed: this.shootSpeed,
    });

    projectile.on(EntityEvent.EXPLODING, () => {
      this.canShoot = true;
    });

    this.emit(EntityEvent.SHOOT, projectile);

    this.shooting = false;
  }

  calculateProjectileInitPos() {
    const defaultSize = { width: 2, height: 2 };
    const rect = this.nextRect || this.lastRect || this.getRect();
    const offsetX = Math.round((rect.width - defaultSize.width) / 2);
    const offsetY = Math.round((rect.height - defaultSize.height) / 2);

    switch (this.direction) {
      case Direction.UP:
        return { posX: rect.posX + offsetX, posY: rect.posY };
      case Direction.DOWN:
        return { posX: rect.posX + offsetX, posY: rect.posY + rect.height - defaultSize.height };
      case Direction.LEFT:
        return { posX: rect.posX, posY: rect.posY + offsetY };
      case Direction.RIGHT:
        return { posX: rect.posX + rect.width - defaultSize.width, posY: rect.posY + offsetY };
    }
  }

  slide(shouldSlide = true) {
    if (shouldSlide) {
      if (!this.sliding) {
        this.emit(EntityEvent.SLIDE);
      }
      this.sliding = true;
      this.slidingStepsProgress = 0;
    } else {
      this.sliding = false;
    }
  }
}
