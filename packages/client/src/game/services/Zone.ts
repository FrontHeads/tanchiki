import { Entity, EntityDynamic } from '../entities';
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

  deleteEntityFromMatrix(entity: Entity | EntityDynamic) {
    const layer = this.getLayerByEntityType(entity);
    if (!(entity instanceof EntityDynamic)) {
      const rect = entity.getRect();
      if (!this.isBeyondMatrix(rect)) {
        this.updateMatrix(layer, rect, null);
      }
    } else {
      let rect = entity.lastRect;
      if (rect) {
        this.updateMatrix(layer, rect, null);
      } else if (entity.alignedToGrid) {
        rect = entity.getRect();
        this.updateMatrix(layer, rect, null);
      }
      if (entity.canMove) {
        rect = entity.nextRect;
        if (rect && !this.isBeyondMatrix(rect)) {
          this.updateMatrix(layer, rect, null);
        }
      }
    }
  }

  registerEntity(entity: Entity) {
    if (entity.type === 'tankExplosion' || entity.type === 'projectileExplosion') {
      return;
    }

    entity.on('entityWillHaveNewPos', (posState: PosState) => {
      const rect = posState.nextRect;
      if (this.hasCollision(rect, entity)) {
        posState.hasCollision = true;
      } else {
        const layer = this.getLayerByEntityType(entity);
        this.updateMatrix(layer, rect, entity);
      }
    });
    entity.on('entityShouldUpdate', (newState: Partial<Entity>) => {
      if (!newState || !('posX' in newState) || !('posY' in newState)) {
        return;
      }
      this.deleteEntityFromMatrix(entity);
    });
    entity.on('entityDidUpdate', (newState: Partial<Entity>) => {
      if (!newState || !('posX' in newState) || !('posY' in newState)) {
        return;
      }
      this.writeEntityToMatrix(entity);
    });
    entity.on('entityShouldBeDestroyed', () => {
      this.deleteEntityFromMatrix(entity);
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
            mainLayerCell.takeDamage(entity);
            return true;
          }
          if (secondaryLayerCell !== null && secondaryLayerCell !== entity) {
            secondaryLayerCell.takeDamage(entity);
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
