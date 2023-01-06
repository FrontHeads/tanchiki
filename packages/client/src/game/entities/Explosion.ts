import { spriteCoordinates } from '../data/constants';
import { EntityEvent, ExplosionVariant } from '../typings';
import { Entity, Projectile, Tank } from './';

type ExplosionSettings = { parentEntity: Tank | Projectile };

export class Explosion extends Entity {
  variant: ExplosionVariant = 'PROJECTILE_EXPLOSION';

  constructor(props: ExplosionSettings) {
    super({ posX: 0, posY: 0 });
    Object.assign(this, this.calculateExplosionProps(props.parentEntity));
    this.type = 'explosion';
    this.crossable = true;
    this.hittable = false;
    this.color = 'transparent';

    let delay = 0;
    switch (this.variant) {
      case 'PROJECTILE_EXPLOSION':
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'TANK_EXPLOSION':
        this.mainSpriteCoordinates = spriteCoordinates.tankExplosion;
        delay = 16; // для более красивой отрисовки взрыва танка нужна задержка
        break;
    }

    this.on(EntityEvent.SPAWN, () => {
      this.startAnimation({
        delay,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });

      // Деспаун взрыва после завершения анимации или спустя 200мс
      this.on(EntityEvent.ANIMATION_ENDED, this.despawn.bind(this));
      this.setLoopDelay(this.despawn.bind(this), 200);
    });
  }

  calculateExplosionProps(entity: Tank | Projectile) {
    const size = entity.type === 'projectile' ? 4 : 8;
    const variant = entity.type === 'projectile' ? 'PROJECTILE_EXPLOSION' : 'TANK_EXPLOSION';
    let posX = entity.posX;
    let posY = entity.posY;

    /** Без коррекции взрыв рисуется не по центру обьекта в который попал снаряд 
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

    return { variant, posX, posY, width: size, height: size };
  }
}
