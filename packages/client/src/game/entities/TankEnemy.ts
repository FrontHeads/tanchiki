import { Direction, EntityDynamicSettings } from '../typings';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  width = 4;
  height = 4;
  shootSpeed = 3;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = 'aqua';
    Object.assign(this, props);

    setInterval(() => {
      this.move(this.getMove());
    }, 1000);
  }
  getMove() {
    const rand = Math.floor(Math.random() * Object.keys(Direction).length);
    const randValue = Object.keys(Direction)[rand];
    return Direction[randValue as keyof typeof Direction];
  }
}
