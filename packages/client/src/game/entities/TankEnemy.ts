import { Direction, EntityDynamicSettings } from '../typings';
import { rand } from '../utils';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  width = 4;
  height = 4;
  shootSpeed = 3;
  lastDirection: Direction = Direction.UP;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = 'aqua';
    Object.assign(this, props);

    this.on('spawn', () => {
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
