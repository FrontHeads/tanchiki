import { Direction, EntityDynamicSettings, PosState } from '../typings';
import { Entity } from './';

export class EntityDynamic extends Entity {
  /** Должен ли объект двигаться*/
  moving = false;
  /** Прекращает ли объект движение (он должен стать по целочисленным координатам)*/
  stopping = false;
  /** Может ли объект двигаться дальше*/
  canMove = true;
  /** На сколько клеток за раз перемещается объект*/
  movePace = 2;
  /** Скорость движения объекта*/
  moveSpeed = 2;
  /** Сколько игровых циклов хода пройдено*/
  moveStepsProgress = 0;
  /** За сколько игровых циклов объект совершает один ход*/
  moveStepsTotal = 8;
  /** Новое направление, по которому объект начнёт движение после завершения полного хода*/
  nextDirection = Direction.UP;
  /** В этом свойстве подсчитываются циклы движения после последнего поворота.
   * Если танк едет, то он поворачивает сразу. А если стоит на месте - то при коротком нажатии клавиши
   * он поворачивает, не двигаясь в сторону.*/
  moveLoops = 0;
  /** Должен ли объект взрываться */
  shouldExplode = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.movable = true;
  }

  /** Рассчитывает количество игровых циклов для одного хода с поправкой на скорость */
  getMoveSteps() {
    return this.moveStepsTotal - this.moveSpeed;
  }

  /** Рассчитывает расстояние, на которое объект пересместится за один игровой цикл */
  getMoveStepPace() {
    return this.movePace / this.getMoveSteps();
  }

  move(direction: Direction) {
    this.moving = true;
    this.nextDirection = direction;
  }

  stop() {
    this.moving = false;
    if (this.moveStepsProgress) {
      this.stopping = true;
    }
  }

  turn(newDirection: Direction = this.nextDirection) {
    if (this.direction !== newDirection) {
      this.setState({ direction: newDirection });
      this.moveLoops = 0;
    }
  }

  /** Вызывается в каждом игровом цикле для определения необходимости двигаться */
  update() {
    const isUnmoved = !this.moving && !this.stopping && !this.shouldExplode;
    const hasNewDirection = this.direction !== this.nextDirection;
    const hasUnfinishedMove = this.moveStepsProgress !== 0;
    if (!this.spawned || isUnmoved) {
      return;
    }
    if (this.shouldExplode) {
      this.stateCheck();
      return;
    }
    if (hasUnfinishedMove) {
      this.moveStep();
      this.stateCheck();
      return;
    }
    if (hasNewDirection) {
      //TODO непонятно что такое 4. Надо обернуть в человекопонятную константу.
      // От чего высчитывается? Зависит ли от moveStepsTotal?
      this.moveLoops > 4 ? this.turn() : this.turnStep();
    }
    this.prepareToMove();
    this.moveStep();
    this.stateCheck();
  }

  /** Выполняет проверку в каждом игровом цикле (нужна для определения столкновения у снарядов) */
  stateCheck() {
    // для Projectile
  }

  /** Чтобы объект не начал двигаться сразу после поворота; */
  turnStep() {
    this.turn();
    ++this.moveStepsProgress;
    this.canMove = false;
  }

  /** Выполняет проверку на то, может ли объект двигаться дальше; */
  prepareToMove() {
    this.lastRect = this.getRect();
    this.nextRect = { ...this.lastRect, ...this.getNextMove(true) };
    const posState: PosState = { hasCollision: false };
    this.emit('entityWillHaveNewPos', posState);
    if (!posState.hasCollision) {
      this.canMove = true;
    } else {
      this.canMove = false;
    }
  }

  /** Рассчитывает координаты следующего хода */
  getNextMove(fullMove = false) {
    let movePace = 0;
    if (fullMove) {
      movePace = this.movePace;
    } else {
      movePace = this.getMoveStepPace();
    }
    switch (this.direction) {
      case 'UP':
        return { posY: this.posY - movePace };
      case 'DOWN':
        return { posY: this.posY + movePace };
      case 'LEFT':
        return { posX: this.posX - movePace };
      case 'RIGHT':
        return { posX: this.posX + movePace };
      default:
        return {}; // чтобы не ругался тайпскрипт (из-за enum Direction)
    }
  }

  /** Выполняет микродвижение за игровой цикл */
  moveStep() {
    const fullCycle = ++this.moveStepsProgress >= this.getMoveSteps();
    if (fullCycle) {
      this.moveStepsProgress = 0;
      this.alignedToGrid = true;
      this.stopping = false;
      if (this.canMove && this.nextRect) {
        this.setState(this.nextRect);
        ++this.moveLoops;
      }
    } else {
      this.alignedToGrid = false;
      if (this.canMove) {
        this.setState(this.getNextMove());
        ++this.moveLoops;
      }
    }
  }
}
