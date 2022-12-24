import { spriteCoordinates } from '../data/constants';
import { Direction, EntityDynamicSettings } from '../typings';
import { rand } from '../utils';
import { EntityEvent } from './../typings/index';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  width = 4;
  height = 4;
  shootSpeed = 3;
  lastDirection: Direction = Direction.UP;
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = 'aqua';
    Object.assign(this, props);
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.a'];

    this.on(EntityEvent.SPAWN, () => {
      this.autoMove();
      this.autoShoot();
    });
  }

  autoMove() {
    this.setLoopDelay(() => {
      if (this.spawned) {
        this.move(this.getMoveDirection());
        this.autoMove();
      }
    }, rand(1000, 2000));
  }

  autoShoot() {
    this.setLoopDelay(() => {
      if (this.spawned) {
        this.shoot();
        this.autoShoot();
      }
    }, rand(1000, 2000));
  }

  getMoveDirection() {
    let direction: Direction;
    do {
      const rand = Math.floor(Math.random() * Object.keys(Direction).length);
      const randValue = Object.keys(Direction)[rand];
      direction = Direction[randValue as keyof typeof Direction];
    } while (this.lastDirection === direction);

    this.lastDirection = direction;
    return direction;
  }
}
