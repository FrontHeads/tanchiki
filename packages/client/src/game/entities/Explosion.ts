import { spriteCoordinates } from '../data/constants';
import { Entity, Projectile, Tank } from './';

type ExplosionSettings = { explosionParentEntity: Tank | Projectile };

export class Explosion extends Entity {
  constructor(props: ExplosionSettings) {
    //@ts-expect-error не передаем posX и posY т.к. они есть в props.explosionParentEntity
    super(props);
    Object.assign(this, this.setExplosionProps(props.explosionParentEntity));
    this.role = 'neutral';
    this.crossable = true;
    this.hittable = false;
    this.color = 'orange';

    switch (this.type) {
      case 'projectileExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'tankExplosion':
        this.mainSpriteCoordinates = spriteCoordinates.tankExplosion;
        break;
    }

    this.on('spawn', () => {
      this.startAnimation({
        delay: 0,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });
    });
  }

  setExplosionProps(entity: Tank | Projectile) {
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
          posY += correction - 2;
          posX += correction;
        }
        if (entity.direction === 'DOWN') {
          posY += correction - 2;
          posX += correction - 2;
        }
      } else {
        posY += correction;
      }
    } else {
      if (entity.type === 'tank') {
        if (entity.direction === 'RIGHT') {
          posY += correction - 2;
          posX += correction;
        }
        if (entity.direction === 'LEFT') {
          posY += correction;
          posX += correction;
        }
      } else {
        posX += correction;
      }
    }

    return { type, posX, posY, width: size, height: size };
  }
}
