import { Direction, EntityDynamicSettings, PosState } from '../typings';
import { Entity } from './';

export class EntityDynamic extends Entity {
  moving = false;
  stopping = false;
  canMove = true;
  movePace = 2;
  moveSpeed = 2;
  moveStepsProgress = 0;
  moveStepsTotal = 8;
  nextDirection = Direction.UP;
  shouldExplode = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.movable = true;
  }

  getMoveSteps() {
    return this.moveStepsTotal - this.moveSpeed;
  }

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

  turn(newDirection: Direction) {
    if (this.direction !== newDirection) {
      this.setState({ direction: newDirection });
    }
  }

  update() {
    if (!this.spawned) {
      return;
    }
    if (!this.moving && !this.stopping && !this.shouldExplode) {
      return;
    }
    if (!this.shouldExplode) {
      if (this.moveStepsProgress === 0) {
        if (this.direction !== this.nextDirection) {
          this.turnStep();
        } else {
          this.prepareToMove();
        }
      }
      this.moveStep();
    }
    this.stateCheck();
  }

  stateCheck() {
    // для Projectile
  }

  turnStep() {
    this.turn(this.nextDirection);
    ++this.moveStepsProgress;
    this.canMove = false;
  }

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

  moveStep() {
    const fullCycle = ++this.moveStepsProgress >= this.getMoveSteps();
    if (fullCycle) {
      this.moveStepsProgress = 0;
      this.alignedToGrid = true;
      this.stopping = false;
      if (this.canMove && this.nextRect) {
        this.setState(this.nextRect);
      }
    } else {
      this.alignedToGrid = false;
      if (this.canMove) {
        this.setState(this.getNextMove());
      }
    }
  }
}
