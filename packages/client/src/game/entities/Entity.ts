import type { DirectionT, PosStateT, RectT } from '../typings';
import { EventBus } from '../utils';

export class Entity extends EventBus {
  posX = 0;
  posY = 0;
  width = 0;
  height = 0;
  direction: DirectionT = 'UP';
  role: 'player1' | 'player2' | 'enemy' | 'neutral' = 'neutral';
  type: 'tank' | 'flag' | 'brickWall' | 'concreteWall' | 'trees' | 'water' | 'ice' | 'custom' = 'custom';
  alignedToGrid = true;
  spawned = false;
  movable = false;
  flying = false;
  crossable = false;
  hittable = true;
  lastRect: RectT | null = null;
  nextRect: RectT | null = null;
  color = 'grey';
  shouldBeDestroyed = false;

  constructor(props: Partial<Entity>) {
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

  spawn({ posX, posY }: Pick<Entity, 'posX' | 'posY'>) {
    this.lastRect = { ...this.getRect(), ...{ posX, posY } };
    this.nextRect = { ...this.lastRect };
    const posState: PosStateT = { hasCollision: false };
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
