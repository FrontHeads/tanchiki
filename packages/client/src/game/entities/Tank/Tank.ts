import { Color } from '../../services/View/colors';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { EntityDynamic, Projectile } from '../';
import { Direction, EntityEvent } from '../Entity/typings';
import { Speed } from '../EntityDynamic/data';
import { type EntityDynamicSettings } from '../EntityDynamic/typings';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  movePace = 2;
  /** Скорость движения танка. Задаётся через метод setMoveSpeed(). */
  moveSpeed = 3;
  moveStepsTotal = 13;
  /** Скорость стрельбы танка. Задаётся через метод setShootSpeed(). */
  shootSpeed = 2;
  /** Количество миллисекунд, в течение которого происходит появление танка на карте. */
  spawnTimeout = 1000;
  /** Может ли танк стрелять (свойство необходимо для ограничения количества выпускаемых снарядов). */
  canShoot = false;
  /** Сколько за раз снарядов может выпустить танк. */
  projectilesLimit = 1;
  /** Сколько снарядов находится в воздухе. */
  projectilesFlying = 0;
  /** Сила взрыва снаряда, выпущенного танком. */
  shootForce = 1;
  /** Должен ли танк выстрелить в данный момент. */
  shooting = false;
  /** Временно блокирует возможность перемещения (например на время анимации спауна). */
  frozen = true;
  /** Дает танку неуязвимость (снаряды не причиняют вреда). */
  invincible = false;
  /** Заносит ли объект на льду. */
  sliding = false;
  /** Сколько циклов объект пробыл в заносе. */
  slidingStepsProgress = 0;
  /** На сколько циклов объект должно заносить. */
  slidingStepsTotal = 20;
  /** Сколько попаданий выдерживает танк. */
  durability = 1;

  constructor(props: EntityDynamicSettings) {
    super({ ...props, type: 'tank' });
    Object.assign(this, props);
    this.color = props.color || Color.Yellow;

    this.registerTankEvents();
  }

  registerTankEvents() {
    this.on(EntityEvent.Spawn, () => {
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
        this.emit(EntityEvent.Ready);
      }, this.spawnTimeout);
    });

    this.on(EntityEvent.Damaged, ({ source }) => {
      if (!this.invincible && this.role !== source.role && --this.durability <= 0) {
        this.beDestroyed(source);
      }
    });
  }

  /** Задаёт скорость движения танка. */
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

  /** Задаёт скорость движения снарядов, выпускаемых из конкретного танка. */
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

  /** Определяет, что танк должен выстрелить. */
  shoot() {
    if (!this.spawned || this.frozen || !this.canShoot || this.projectilesFlying >= this.projectilesLimit) {
      return;
    }

    this.shooting = true;
  }

  /** Реализует скольжение и стрельбу танка через игровой цикл. */
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
      explosionForce: this.shootForce,
    });

    ++this.projectilesFlying;

    projectile.on(EntityEvent.Exploding, () => {
      --this.projectilesFlying;
    });

    this.emit(EntityEvent.Shoot, projectile);

    this.shooting = false;
  }

  /** Высчитывает начальную позицию снаряда, вылетающего из танка. */
  calculateProjectileInitPos() {
    const defaultSize = { width: 2, height: 2 };
    const rect = this.nextRect || this.lastRect || this.getRect();
    const offsetX = Math.round((rect.width - defaultSize.width) / 2);
    const offsetY = Math.round((rect.height - defaultSize.height) / 2);

    switch (this.direction) {
      case Direction.Up:
        return { posX: rect.posX + offsetX, posY: rect.posY };
      case Direction.Down:
        return { posX: rect.posX + offsetX, posY: rect.posY + rect.height - defaultSize.height };
      case Direction.Left:
        return { posX: rect.posX, posY: rect.posY + offsetY };
      case Direction.Right:
        return { posX: rect.posX + rect.width - defaultSize.width, posY: rect.posY + offsetY };
    }
  }

  /** Определяет, должен ли танк скользить. */
  slide(shouldSlide = true) {
    if (shouldSlide) {
      if (!this.sliding) {
        this.emit(EntityEvent.Slide);
      }
      this.sliding = true;
      this.slidingStepsProgress = 0;
    } else {
      this.sliding = false;
    }
  }
}
