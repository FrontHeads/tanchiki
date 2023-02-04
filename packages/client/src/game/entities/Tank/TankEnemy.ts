import { Color } from '../../services/View/colors';
import { type SpriteCoordinatesNoAnimations, type SpriteCoordinatesWithAnimations } from '../../services/View/typings';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { rand } from '../../utils';
import { Direction, EntityEvent } from '../Entity/typings';
import { Speed } from '../EntityDynamic/data';
import { Tank } from './Tank';
import { type EnemyVariant, type TankEnemySettings } from './typings';

export class TankEnemy extends Tank {
  lastDirection = Direction.Down;
  /** Разновидность вражеского танка */
  variant: EnemyVariant = 'BASIC';
  /** Переливающийся танк, за уничтожение которого дают бонус. */
  flashing = false;
  /** Альтернативный спрайт (используется для переливающихся танков). */
  secondarySpriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;

  constructor(props: TankEnemySettings) {
    super({ posX: 0, posY: 0 });
    this.color = Color.Aqua;
    this.role = 'enemy';
    Object.assign(this, props);

    switch (this.variant) {
      case 'FAST':
        this.setMoveSpeed(Speed.High);
        this.setShootSpeed(Speed.Medium);
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.b'];
        this.secondarySpriteCoordinates = spriteCoordinates['tank.enemy.danger.b'];
        break;
      case 'POWER':
        this.setMoveSpeed(Speed.Medium);
        this.setShootSpeed(Speed.High);
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.c'];
        this.secondarySpriteCoordinates = spriteCoordinates['tank.enemy.danger.c'];
        break;
      case 'ARMOR':
        this.setMoveSpeed(Speed.Low);
        this.setShootSpeed(Speed.Medium);
        this.durability = 4;
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.secondary.d'];
        this.secondarySpriteCoordinates = spriteCoordinates['tank.enemy.danger.d'];
        break;
      default:
        this.setMoveSpeed(Speed.Low);
        this.setShootSpeed(Speed.Low);
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.a'];
        this.secondarySpriteCoordinates = spriteCoordinates['tank.enemy.danger.a'];
    }

    this.registerTankEnemyEvents();
  }

  registerTankEnemyEvents() {
    this.on(EntityEvent.Ready, () => {
      this.move(Direction.Down);
      this.autoMove();
      this.autoShoot();

      if (this.flashing) {
        this.setFlashing();
      }
    });

    this.on(EntityEvent.Damaged, () => {
      // Для смены скинов у бронированного танка при попадании
      if (this.variant !== 'ARMOR') {
        return;
      }
      if (this.durability === 3) {
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.primary.d'];
      }
      if (this.durability === 2) {
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.secondary.d'];
      }
      if (this.durability === 1) {
        this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.d'];
      }
      this.secondarySpriteCoordinates = spriteCoordinates['tank.enemy.danger.d'];
    });
  }

  setFlashing() {
    const flashingIntervalMs = 200;
    const flashingIntervalName = 'flashing' + rand(0, 999999);

    this.setLoopInterval(
      () => {
        const tempSpriteCoordinates = this.mainSpriteCoordinates;
        this.mainSpriteCoordinates = this.secondarySpriteCoordinates;
        this.secondarySpriteCoordinates = tempSpriteCoordinates;
      },
      flashingIntervalMs,
      flashingIntervalName
    );
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
