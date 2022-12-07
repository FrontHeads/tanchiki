import type { Entity } from '../entities';
import type { PosState, Rect, Size } from '../typings';

export class Zone {
  width = 0;
  height = 0;
  matrix!: Array<Array<Array<Entity | null>>>;

  constructor({ width, height }: Size) {
    this.width = width;
    this.height = height;
    this.build();
  }

  reset() {
    this.build();
  }

  build() {
    const layers = ['main', 'projectiles', 'powerups'];
    this.matrix = Array(layers.length);
    for (let z = 0; z < this.matrix.length; ++z) {
      this.matrix[z] = Array(this.width);
      for (let x = 0; x < this.matrix[z].length; ++x) {
        this.matrix[z][x] = Array(this.height).fill(null);
      }
    }
  }

  add(entity: Entity) {
    this.registerEntity(entity);
  }

  getLayerByEntityType(entity: Entity) {
    switch (entity.type) {
      case 'projectile':
        return 1;
      case 'powerup':
        return 2;
      default:
        return 0;
    }
  }

  updateMatrix(z: number, rect: Rect, value: Entity | null) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        this.matrix[z][x][y] = value;
      }
    }
  }

  writeEntityToMatrix(entity: Entity) {
    if (entity.alignedToGrid) {
      const layer = this.getLayerByEntityType(entity);
      this.updateMatrix(layer, entity.getRect(), entity);
    }
  }

  deleteEntityFromMatrix(entity: Entity) {
    if (!entity.lastRect) {
      throw new Error('entity.lastRect is null');
    }
    if (entity.alignedToGrid) {
      const layer = this.getLayerByEntityType(entity);
      this.updateMatrix(layer, entity.lastRect, null);
    }
  }

  destroyEntity(entity: Entity) {
    if (!entity.lastRect || !entity.nextRect) {
      throw new Error('entity.lastRect|nextRect is null');
    }
    const layer = this.getLayerByEntityType(entity);
    this.updateMatrix(layer, entity.lastRect, null);
    if (!entity.alignedToGrid) {
      this.updateMatrix(layer, entity.nextRect, null);
    } else {
      this.updateMatrix(layer, entity.getRect(), null);
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
        const layer = this.getLayerByEntityType(entity);
        this.updateMatrix(layer, entity.nextRect, entity);
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
        const mainLayerCell = this.matrix[0][x][y];
        const secondaryLayerCell = this.matrix[1][x][y];

        if (mainLayerCell === null && secondaryLayerCell === null) {
          continue;
        }
        if (entity.type === 'tank') {
          if (mainLayerCell !== null && mainLayerCell !== entity && !mainLayerCell.crossable) {
            return true;
          }
          if (secondaryLayerCell !== null) {
            return true;
          }
        }
        if (entity.type === 'projectile') {
          if (mainLayerCell !== null && mainLayerCell.hittable) {
            mainLayerCell.takeDamage();
            return true;
          }
          if (secondaryLayerCell !== null && secondaryLayerCell !== entity) {
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
