import { type EntityDynamicSettings, type PosState, type Rect, Direction } from '../typings';
import { EntityEvent } from './../typings/index';
import { Entity } from './';

export abstract class EntityDynamic extends Entity {
  /** Должен ли объект двигаться. */
  moving = false;
  /** Прекращает ли объект движение (он должен стать по целочисленным координатам). */
  stopping = false;
  /** Может ли объект двигаться дальше. */
  canMove = true;
  /** Клетка, где объект находился до начала движения. */
  lastRect: Rect | null = null;
  /** Клетка, куда объект движется*/
  nextRect: Rect | null = null;
  /** На сколько клеток за раз перемещается объект. */
  movePace = 2;
  /** Скорость движения объекта. */
  moveSpeed = 3;
  /** Сколько игровых циклов хода пройдено. */
  moveStepsProgress = 0;
  /** За сколько игровых циклов объект совершает один ход. */
  moveStepsTotal = 12;
  /** Новое направление, по которому объект начнёт движение после завершения полного хода. */
  nextDirection = Direction.Up;
  /** В этом свойстве подсчитываются циклы движения после последнего поворота.
   * Если танк едет, то он поворачивает сразу. А если стоит на месте - то при коротком нажатии клавиши
   * он поворачивает, не двигаясь в сторону.*/
  moveLoops = 0;
  /** Временно блокирует возможность перемещения (например на время отрисовки анимации спауна). */
  frozen = false;

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

  /** Начинает движение объекта в заданном направлении. */
  move(direction: Direction) {
    this.moving = true;
    this.nextDirection = direction;

    if (this.spawned && !this.frozen) {
      this.emit(EntityEvent.Move);
    }
  }

  /** Останавливает движение объекта. */
  stop() {
    this.moving = false;
    if (this.moveStepsProgress) {
      this.stopping = true;
    }

    this.emit(EntityEvent.Stop);
  }

  /** Поворачивает объект на месте. */
  turn(newDirection: Direction = this.nextDirection) {
    if (this.direction !== newDirection) {
      this.emit(EntityEvent.Stop);
      if (this.moving) {
        this.emit(EntityEvent.Move);
      }
      this.setState({ direction: newDirection });
      this.moveLoops = 0;
    }
  }

  /** Вызывается в каждом игровом цикле для определения необходимости двигаться. */
  update() {
    if (!this.spawned || this.frozen) {
      return;
    }

    this.stateCheck();
    if (this.shouldBeDestroyed) {
      return;
    }

    const isStandingStill = !this.moving && !this.stopping && !this.shouldBeDestroyed;
    if (isStandingStill) {
      return;
    }

    const hasUnfinishedMove = this.moveStepsProgress !== 0;
    if (hasUnfinishedMove) {
      this.moveStep();
      return;
    }

    const hasNewDirection = this.stopping ? false : this.direction !== this.nextDirection;
    const canTurnWithoutInterrupt = this.moveLoops > this.getMoveSteps();
    if (hasNewDirection) {
      /** Проверка для того, чтобы объект мог поворачивать на месте без последующего движения в сторону. */
      canTurnWithoutInterrupt ? this.turn() : this.turnWithInterrupt();
    } else {
      this.prepareToMove();
      this.moveStep();
    }
  }

  /** Выполняет проверку в каждом игровом цикле 
   * (нужна для определения столкновения у снарядов, а также стрельбы и скольжения у танков). */
  abstract stateCheck(): void;

  /** Чтобы объект не начал двигаться сразу после поворота. */
  turnWithInterrupt() {
    this.turn();
    ++this.moveStepsProgress;
    this.canMove = false;
  }

  /** Выполняет проверку на то, может ли объект двигаться дальше. */
  prepareToMove() {
    this.lastRect = this.getRect();
    const nextRect = { ...this.lastRect, ...this.getNextMove(true) };
    const posState: PosState = {
      hasCollision: undefined,
      nextRect,
    };
    this.emit(EntityEvent.WillHaveNewPos, posState);
    if (!posState.hasCollision) {
      this.canMove = true;
      this.nextRect = nextRect;
    } else {
      this.canMove = false;
      this.nextRect = null;
    }
  }

  /** Рассчитывает координаты следующего хода. */
  getNextMove(fullMove = false) {
    let movePace = 0;
    if (fullMove) {
      movePace = this.movePace;
    } else {
      movePace = this.getMoveStepPace();
    }

    switch (this.direction) {
      case Direction.Up:
        return { posY: this.posY - movePace };
      case Direction.Down:
        return { posY: this.posY + movePace };
      case Direction.Left:
        return { posX: this.posX - movePace };
      case Direction.Right:
        return { posX: this.posX + movePace };
    }
  }

  /** Выполняет микродвижение за игровой цикл. */
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
      } else {
        this.refreshSprite();
      }
    }
  }
}
