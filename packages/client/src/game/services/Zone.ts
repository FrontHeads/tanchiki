import type { Entity } from '../entities';
import type { PosState, Rect, Size } from '../typings';

export class Zone {
  width = 0;
  height = 0;
  matrix!: Array<Array<Entity | null>>;

  constructor({ width, height }: Size) {
    this.width = width;
    this.height = height;
    this.buildMatrix();
  }

  buildMatrix() {
    this.matrix = Array(this.width);
    for (let x = 0; x < this.matrix.length; ++x) {
      this.matrix[x] = Array(this.height).fill(null);
    }
  }

  updateMatrix(rect: Rect, value: Entity | null) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        this.matrix[x][y] = value;
      }
    }
  }

  writeEntityToMatrix(entity: Entity) {
    if (entity.alignedToGrid) {
      this.updateMatrix(entity.getRect(), entity);
    }
  }

  deleteEntityFromMatrix(entity: Entity) {
    if (!entity.lastRect) {
      throw new Error('entity.lastRect is null');
    }
    if (entity.alignedToGrid) {
      this.updateMatrix(entity.lastRect, null);
    }
  }

  destroyEntity(entity: Entity) {
    if (!entity.lastRect || !entity.nextRect) {
      throw new Error('entity.lastRect|nextRect is null');
    }
    this.updateMatrix(entity.lastRect, null);
    if (!entity.alignedToGrid) {
      this.updateMatrix(entity.nextRect, null);
    } else {
      this.updateMatrix(entity.getRect(), null);
    }
  }

  registerEntity(entity: Entity) {
    entity.on('entityWillHaveNewPos', (posState: PosState) => {
      if (!entity.lastRect || !entity.nextRect) {
        throw new Error('entity.lastRect|nextRect is null');
      }
      if (this.hasCollision(entity.nextRect, entity)) {
        posState.hasCollision = true;
      } else {
        this.updateMatrix(entity.nextRect, entity);
      }
    });
    entity.on('entityShouldUpdate', (newState: Partial<Entity>) => {
      if (!('posX' in newState) || !('posY' in newState)) {
        return;
      }
      this.deleteEntityFromMatrix(entity);
    });
    entity.on('entityDidUpdate', (newState: Partial<Entity>) => {
      if (!('posX' in newState) || !('posY' in newState)) {
        return;
      }
      this.writeEntityToMatrix(entity);
    });
    entity.on('entityShouldBeDestroyed', () => {
      this.destroyEntity(entity);
    });
  }

  isBeyondMatrix(rect: Rect) {
    if (this.isBeyondXAxis(rect) || this.isBeyondYAxis(rect)) {
      return true;
    }
    return false;
  }

  isBeyondXAxis(rect: Rect) {
    const offsetX = rect.posX + rect.width;
    if (rect.posX < 0 || offsetX > this.width) {
      return true;
    }
    return false;
  }

  isBeyondYAxis(rect: Rect) {
    const offsetY = rect.posY + rect.height;
    if (rect.posY < 0 || offsetY > this.height) {
      return true;
    }
    return false;
  }

  hasCollisionsWithMatrix(rect: Rect, entity: Entity) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        const cell = this.matrix[x][y];
        if (cell !== entity && cell !== null) {
          if (entity.flying && cell.hittable) {
            return true;
          } else if (!entity.flying && !cell.crossable) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasCollision(rect: Rect, entity: Entity) {
    if (this.isBeyondMatrix(rect) || this.hasCollisionsWithMatrix(rect, entity)) {
      return true;
    }
    return false;
  }
}
