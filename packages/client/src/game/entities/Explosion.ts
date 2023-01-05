import { Color, spriteCoordinates } from '../data/constants';
import { EntityEvent } from './../typings/index';
import { Entity, Projectile, Tank } from './';

type ExplosionSettings = { explosionParentEntity: Tank | Projectile };

export class Explosion extends Entity {
  constructor(props: ExplosionSettings) {
    super({ posX: 0, posY: 0 });
    Object.assign(this, this.calculateExplosionProps(props.explosionParentEntity));
    this.role = 'neutral';
    this.crossable = true;
    this.hittable = false;
    this.color = Color.Transparent;

    switch (this.type) {
      case 'projectileExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'tankExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.tankExplosion;
        break;
    }

    this.on(EntityEvent.SPAWN, () => {
      this.startAnimation({
        delay: 0,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });
    });
  }

  calculateExplosionProps(entity: Tank | Projectile) {
    const size = entity.type === 'projectile' ? 4 : 8;
    const type = entity.type === 'projectile' ? 'projectileExplosion' : 'tankExplosion';
    let posX = entity.posX;
    let posY = entity.posY;

    /**Без коррекции взрыв рисуется не по центру обьекта в который попал снаряд 
    из-за несовпадения координат и разницы в размерах взрыва и обьекта. */
    const correction = entity.direction === 'UP' || entity.direction === 'LEFT' ? -2 : 0;

    if (entity.direction === 'UP' || entity.direction === 'DOWN') {
      if (entity.type === 'tank') {
        if (entity.direction === 'UP') {
          posX += correction;
          posY += correction - 2;
        }
        if (entity.direction === 'DOWN') {
          posX += correction - 2;
          posY += correction - 2;
        }
      } else {
        posX -= 1;
        posY += correction;
      }
    } else {
      if (entity.type === 'tank') {
        if (entity.direction === 'RIGHT') {
          posX += correction;
          posY += correction - 2;
        }
        if (entity.direction === 'LEFT') {
          posX += correction;
          posY += correction;
        }
      } else {
        posX += correction;
        posY -= 1;
      }
    }

    return { type, posX, posY, width: size, height: size };
  }
}
