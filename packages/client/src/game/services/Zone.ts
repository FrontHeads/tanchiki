import { Entity, EntityDynamic, Projectile, Tank } from '../entities';
import type { PosState, Rect, Size } from '../typings';
import { EntityEvent } from './../typings/index';

enum ZoneLayers {
  Main,
  Secondary,
  Projectiles,
  Powerups,
}

export class Zone {
  width = 0;
  height = 0;
  matrix: Array<Array<Array<Entity | null>>>;

  constructor({ width, height }: Size) {
    this.width = width;
    this.height = height;

    /**
     * Создаёт матрицу - карту местности, где указано расположение всех игровых объектов
     * Используется три уровня/слоя для отдельных типов сущностей,
     * т.к. некоторые из них могут накладываться друг на друга
     */
    this.matrix = [];
    for (const z of Object.values(ZoneLayers)) {
      if (typeof z !== 'number') {
        continue;
      }
      this.matrix[z] = Array(this.width);
      for (let x = 0; x < this.matrix[z].length; ++x) {
        this.matrix[z][x] = Array(this.height).fill(null);
      }
    }
  }

  /** Возвращает слой матрицы, на которой должна находиться сущность */
  getLayerByEntityType(entity: Entity) {
    switch (entity.type) {
      case 'ice':
      case 'trees':
        return ZoneLayers.Secondary;
      case 'projectile':
        return ZoneLayers.Projectiles;
      case 'powerup':
        return ZoneLayers.Powerups;
      default:
        return ZoneLayers.Main;
    }
  }

  /** Очищает матрицу (вызывается перед каждым новым игровым уровнем) */
  reset() {
    for (let z = 0; z < this.matrix.length; ++z) {
      this.updateMatrix(z, { posX: 0, posY: 0, width: this.width, height: this.height }, null);
    }
  }

  /** Алиас для registerEntity */
  add(entity: Entity) {
    this.registerEntity(entity);
  }

  /** Добавляет сущность в заданный прямоугольник на определённом слое */
  updateMatrix(z: number, rect: Rect, value: Entity | null) {
    if (this.isBeyondMatrix(rect) || !this.isLegalRect(rect)) {
      return;
    }
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        this.matrix[z][x][y] = value;
      }
    }
  }

  /** Добавляет сущность в матрицу */
  writeEntityToMatrix(entity: Entity) {
    if (entity.alignedToGrid) {
      const layer = this.getLayerByEntityType(entity);
      const rect = entity.getRect();
      this.updateMatrix(layer, rect, entity);
    }
  }

  /** Удаляет сущность из матрицы */
  deleteEntityFromMatrix(entity: Entity | EntityDynamic) {
    const layer = this.getLayerByEntityType(entity);
    if (!(entity instanceof EntityDynamic)) {
      const rect = entity.getRect();
      this.updateMatrix(layer, rect, null);
    } else {
      let rect = entity.lastRect;
      if (rect) {
        this.updateMatrix(layer, rect, null);
      } else {
        rect = entity.getRect();
        this.updateMatrix(layer, rect, null);
      }
      if (entity.nextRect) {
        rect = entity.nextRect;
        this.updateMatrix(layer, rect, null);
      }
    }
  }

  /** Подписывается на события сущности, которые отслеживаются для обновления матрицы */
  registerEntity(entity: Entity) {
    if (entity.type === 'score' || entity.type === 'explosion') {
      return;
    }

    entity.on(EntityEvent.WILL_HAVE_NEW_POS, (posState: PosState) => {
      const rect = posState.nextRect;
      if (this.hasCollision(rect, entity)) {
        posState.hasCollision = true;
      } else {
        const layer = this.getLayerByEntityType(entity);
        this.updateMatrix(layer, rect, entity);

        if (entity instanceof Tank && entity.sliding) {
          entity.sliding = this.shouldSlide(rect);
        }
      }
    });

    entity.on(EntityEvent.SHOULD_UPDATE, (newState: Partial<Entity>) => {
      if (!newState || !('posX' in newState) || !('posY' in newState)) {
        return;
      }
      if (!entity.spawned) {
        return;
      }
      this.deleteEntityFromMatrix(entity);
    });

    entity.on(EntityEvent.DID_UPDATE, (newState: Partial<Entity>) => {
      if (!newState || !('posX' in newState) || !('posY' in newState)) {
        return;
      }
      this.writeEntityToMatrix(entity);
    });

    entity.on(EntityEvent.SHOULD_BE_DESTROYED, () => {
      this.deleteEntityFromMatrix(entity);
    });

    entity.on(EntityEvent.WILL_DO_DAMAGE, (rect: Rect) => {
      this.doDamage(rect, entity);
    });

    if (entity instanceof Tank) {
      entity.on(EntityEvent.STOP, () => {
        entity.slide(this.shouldSlide(entity.nextRect || entity.lastRect || entity.getRect()));
      });
    }

    if (entity.type === 'brickWall') {
      entity.on(EntityEvent.DAMAGED, (rect: Rect) => {
        const layer = this.getLayerByEntityType(entity);
        this.updateMatrix(layer, rect, null);
      });
    }
  }

  /** Проверяет, все ли параметры прямоугольника целочисленные */
  isLegalRect(rect: Rect) {
    if (rect.posX % 1 === 0 && rect.posY % 1 === 0 && rect.width % 1 === 0 && rect.height % 1 === 0) {
      return true;
    }
    return false;
  }

  /** Проверка на предмет координат прямоугольника, которые не соответствуют матрице */
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

  /** Наносит урон по заданному прямоугольнику */
  doDamage(rect: Rect, source: Entity) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        const mainLayerCell = this.matrix[ZoneLayers.Main][x]?.[y];
        const projectileLayerCell = this.matrix[ZoneLayers.Projectiles][x]?.[y];
        // Урон наносится по каждой клетке, координаты которой передаются дальше
        // (это нужно для частичного разрушения стен и уничтожения сразу нескольких объектов)
        const damagedRect = { posX: x, posY: y, width: 1, height: 1 };
        if (mainLayerCell && mainLayerCell.hittable) {
          mainLayerCell.takeDamage(source, damagedRect);
        }
        if (projectileLayerCell) {
          projectileLayerCell.takeDamage(source, damagedRect);
        }
      }
    }
  }

  /** Проверяет, должен ли скользить объект на льду */
  shouldSlide(rect: Rect) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        const secondaryLayerCell = this.matrix[ZoneLayers.Secondary][x]?.[y];
        if (!secondaryLayerCell || secondaryLayerCell.type !== 'ice') {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Проверяет, находится ли по заданным координатам какая-либо ещё сущность.
   * Если да, то совершает над ней необходимые операции
   */
  hasCollisionsWithMatrix(rect: Rect, entity: Entity) {
    for (let x = rect.posX + rect.width - 1; x >= rect.posX; --x) {
      for (let y = rect.posY + rect.height - 1; y >= rect.posY; --y) {
        const mainLayerCell = this.matrix[ZoneLayers.Main][x]?.[y];
        const projectileLayerCell = this.matrix[ZoneLayers.Projectiles][x]?.[y];

        if (!mainLayerCell && !projectileLayerCell) {
          continue;
        }
        if (entity instanceof Tank) {
          if (mainLayerCell !== null && mainLayerCell !== entity && !mainLayerCell.crossable) {
            return true;
          }
        }
        if (entity instanceof Projectile) {
          if (mainLayerCell !== null && mainLayerCell.hittable && mainLayerCell !== entity.parent) {
            // Чтобы вражеские танки могли стрелять друг через друга
            if (entity.role === 'enemy' && entity.role === mainLayerCell.role) {
              continue;
            }
            return true;
          }
          if (projectileLayerCell !== null && projectileLayerCell !== entity) {
            // Чтобы вражеские снаряды могли пролетать друг через друга
            if (entity.role === 'enemy' && entity.role === projectileLayerCell.role) {
              continue;
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  /** Проверка на предмет столкновений сущностей и координат, которые выходят за пределы матрицы */
  hasCollision(rect: Rect, entity: Entity) {
    if (this.isBeyondMatrix(rect) || this.hasCollisionsWithMatrix(rect, entity)) {
      return true;
    }
    return false;
  }
}
