import { Direction, EntityDynamicSettings } from '../typings';
import { Tank } from './Tank';
import { rand } from '../utils';

export class TankEnemy extends Tank {
  width = 4;
  height = 4;
  shootSpeed = 3;
  lastDirection: Direction = Direction.UP;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = 'aqua';
    Object.assign(this, props);

    /*const moveInternval = setInterval(() => {
      this.move(this.getMoveDirection());
    }, 1000);

    const shootInternval = setInterval(() => {
      this.shoot();
    }, 1000);

    this.on('entityShouldBeDestroyed', () => {
      clearInterval(moveInternval);
      clearInterval(shootInternval);
    });
    */
    this.on('spawned', () => {
      this.autoMove();
      this.autoShoot();
    });
  }

  autoMove() {
    this.setLoopDelay(() => {
      this.move(this.getMoveDirection());
      if (this.spawned) {
        this.autoMove();
      }
    }, rand(1000, 2000));
  }

  autoShoot() {
    this.setLoopDelay(() => {
      this.shoot();
      if (this.spawned) {
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
