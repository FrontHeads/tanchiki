import { Direction, EntitySettings, Pos, PosState, Rect } from '../typings';
import { EventEmitter } from '../utils';

export class Entity extends EventEmitter {
  posX = 0;
  posY = 0;
  width = 0;
  height = 0;
  direction = Direction.UP;
  role: 'player1' | 'player2' | 'enemy' | 'neutral' = 'neutral';
  type: 'tank' | 'flag' | 'brickWall' | 'concreteWall' | 'trees' | 'water' | 'ice' | 'custom' = 'custom';
  alignedToGrid = true;
  spawned = false;
  movable = false;
  flying = false;
  crossable = false;
  hittable = true;
  lastRect: Rect | null = null;
  nextRect: Rect | null = null;
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

  spawn({ posX, posY }: Pos) {
    this.lastRect = { ...this.getRect(), posX, posY };
    this.nextRect = { ...this.lastRect };
    const posState: PosState = { hasCollision: false };
    this.emit('entityWillHaveNewPos', posState);
    if (!posState.hasCollision) {
      this.setState({ posX, posY });
      this.spawned = true;
    }
  }

  despawn() {
    this.emit('entityShouldBeDestroyed');
    this.spawned = false;
  }
}
