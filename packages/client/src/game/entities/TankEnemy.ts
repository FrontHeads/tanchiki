import { Color } from '../data/colors';
import { spriteCoordinates } from '../data/constants';
import { type EntityDynamicSettings, Direction, EntityEvent, Speed } from '../typings';
import { rand } from '../utils';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  lastDirection = Direction.DOWN;
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = Color.Aqua;
    this.role = 'enemy';
    this.setMoveSpeed(Speed.Low);
    this.setShootSpeed(Speed.Low);
    Object.assign(this, props);
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.a'];

    this.on(EntityEvent.READY, () => {
      this.move(Direction.DOWN);
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
    }, rand(500, 1000));
  }

  autoShoot() {
    this.setLoopDelay(() => {
      if (this.spawned) {
        this.shoot();
        this.autoShoot();
      }
    }, rand(500, 1000));
  }

  getRandomDirection() {
    const directions = [
      ...new Array(1).fill(Direction.UP),
      ...new Array(6).fill(Direction.DOWN),
      ...new Array(3).fill(Direction.LEFT),
      ...new Array(3).fill(Direction.RIGHT),
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  getRandomAction() {
    const actions = [...new Array(1).fill('turn'), ...new Array(5).fill('move')];

    return actions[Math.floor(Math.random() * actions.length)];
  }

  getMoveDirection() {
    if (this.canMove && this.getRandomAction() === 'move') {
      return this.direction;
    }

    let newDirection: Direction;
    do {
      newDirection = this.getRandomDirection();
    } while (
      this.lastDirection === newDirection ||
      (newDirection === Direction.UP && this.posY === 2) ||
      (newDirection === Direction.DOWN && this.posY === 50) ||
      (newDirection === Direction.LEFT && this.posX === 2) ||
      (newDirection === Direction.RIGHT && this.posX === 50)
    );

    this.lastDirection = newDirection;
    return newDirection;
  }
}
