import { Color } from '../../services/View/colors';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { type SpriteCoordinatesNoAnimations, type SpriteCoordinatesWithAnimations } from '../../services/View/typings';
import { rand } from '../../utils';
import { Direction, EntityEvent } from '../Entity/typings';
import { Speed } from '../EntityDynamic/data';
import { Tank } from './Tank';
import { type EnemyVariant, type TankEnemySettings } from './typings';
import { GameDifficulty } from '../../services';

export class TankEnemy extends Tank {
  lastDirection = Direction.Down;
  /** Разновидность вражеского танка */
  variant: EnemyVariant = 'BASIC';
  /** Переливающийся танк, за уничтожение которого дают бонус. */
  flashing = false;
  /** Сложность ИИ. */
  difficulty = GameDifficulty.Hard;
  /** Быстрота реакции ИИ (минимум мс). */
  minReactionTime = 500;
  /** Быстрота реакции ИИ (максимум мс). */
  maxReactionTime = 1000;
  /** Вероятность решения ИИ повернуть. */
  turnChance = 1;
  /** Вероятность решения ИИ двигаться дальше. */
  keepMovingChance = 5;
  /** Вероятность решения ИИ двигаться вверх. */
  moveUpChance = 1;
  /** Вероятность решения ИИ двигаться вниз. */
  moveDownChance = 6;
  /** Вероятность решения ИИ двигаться вправо или влево. */
  moveSidewaysChance = 3;
  /** Альтернативный спрайт (используется для переливающихся танков). */
  secondarySpriteCoordinates: SpriteCoordinatesNoAnimations | SpriteCoordinatesWithAnimations = null;

  constructor(props: TankEnemySettings) {
    super({ posX: 0, posY: 0 });
    this.color = Color.Aqua;
    this.role = 'enemy';
    Object.assign(this, props);

    if (this.difficulty === GameDifficulty.Easy) {
      this.minReactionTime = 1000;
      this.maxReactionTime = 2000;
      this.moveUpChance = 2;
      this.moveDownChance = 3;
      this.keepMovingChance = 3;
    }

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
      this.refreshSprite();
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
        this.refreshSprite();
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
    }, rand(this.minReactionTime, this.maxReactionTime));
  }

  autoShoot() {
    this.setLoopDelay(() => {
      if (this.spawned) {
        this.shoot();
        this.autoShoot();
      }
    }, rand(this.minReactionTime, this.maxReactionTime));
  }

  getRandomDirection() {
    const directions = [
      ...new Array(this.moveUpChance).fill(Direction.Up),
      ...new Array(this.moveDownChance).fill(Direction.Down),
      ...new Array(this.moveSidewaysChance).fill(Direction.Left),
      ...new Array(this.moveSidewaysChance).fill(Direction.Right),
    ];

    return directions[Math.floor(Math.random() * directions.length)];
  }

  getRandomAction() {
    const actions = [...new Array(this.turnChance).fill('turn'), ...new Array(this.keepMovingChance).fill('move')];

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
