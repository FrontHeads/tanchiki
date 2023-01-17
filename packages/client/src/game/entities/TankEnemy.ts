import { Color } from '../data/colors';
import { spriteCoordinates } from '../data/constants';
import { type EnemyVariant, type EntityDynamicSettings, Direction, EntityEvent, Speed } from '../typings';
import { rand } from '../utils';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  lastDirection = Direction.Down;
  /** Разновидность вражеского танка */
  variant: EnemyVariant = 'BASIC';

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = Color.Aqua;
    this.role = 'enemy';
    this.setMoveSpeed(Speed.Low);
    this.setShootSpeed(Speed.Low);
    Object.assign(this, props);
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.a'];

    this.registerTankEnemyEvents();
  }

  registerTankEnemyEvents() {
    this.on(EntityEvent.Ready, () => {
      this.move(Direction.Down);
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
      ...new Array(1).fill(Direction.Up),
      ...new Array(6).fill(Direction.Down),
      ...new Array(3).fill(Direction.Left),
      ...new Array(3).fill(Direction.Right),
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
      (newDirection === Direction.Up && this.posY === 2) ||
      (newDirection === Direction.Down && this.posY === 50) ||
      (newDirection === Direction.Left && this.posX === 2) ||
      (newDirection === Direction.Right && this.posX === 50)
    );

    this.lastDirection = newDirection;
    return newDirection;
  }
}
