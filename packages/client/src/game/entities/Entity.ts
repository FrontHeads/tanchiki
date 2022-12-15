import { Direction, EntityRole, EntitySettings, EntityType, Pos, PosState } from '../typings';
import { EventEmitter } from '../utils';

export class Entity extends EventEmitter {
  posX = 0;
  posY = 0;
  width = 0;
  height = 0;
  direction = Direction.UP;
  role: EntityRole = 'neutral';
  type: EntityType = 'custom';
  alignedToGrid = true;
  spawned = false;
  movable = false;
  flying = false;
  crossable = false;
  hittable = true;
  color = 'grey';
  shouldBeDestroyed = false;

  constructor(props: EntitySettings) {
    super();
    Object.assign(this, props);
  }

  setState(newState: Partial<Entity>) {
    this.emit('entityShouldUpdate', newState);
    Object.assign(this, newState);
    this.emit('entityDidUpdate', newState);
  }

  getRect() {
    return { posX: this.posX, posY: this.posY, width: this.width, height: this.height };
  }

  spawn({ posX = this.posX, posY = this.posY }: Pos) {
    const posState: PosState = {
      hasCollision: undefined,
      nextRect: { posX, posY, width: this.width, height: this.height },
    };
    this.emit('entityWillHaveNewPos', posState);
    if (!posState.hasCollision) {
      this.setState({ posX, posY });
      this.spawned = true;
    } else if (this.type === 'projectile') {
      this.explode();
    }

    return this.spawned;
  }

  despawn() {
    if (!this.spawned) {
      return;
    }
    this.shouldBeDestroyed = true;
    this.emit('entityShouldBeDestroyed');
    this.spawned = false;
  }

  explode() {
    this.emit('exploding');
    this.despawn();
  }

  takeDamage(source: Entity) {
    this.emit('damaged');
    if (this.type === 'projectile') {
      this.explode();
    } else if (this.type === 'tank') {
      if (this.role !== source.role) {
        this.explode();
        this.emit('destroyed', source);
      }
    }
  }
}
