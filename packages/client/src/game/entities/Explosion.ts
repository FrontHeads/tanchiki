import { spriteCoordinates } from '../data/constants';
import { EntityEvent, ExplosionVariant } from '../typings';
import { Entity, Projectile, Tank } from './';

type ExplosionSettings = { parent: Tank | Projectile };

export class Explosion extends Entity {
  variant: ExplosionVariant = 'PROJECTILE_EXPLOSION';
  parent: ExplosionSettings['parent'];

  constructor(settings: ExplosionSettings) {
    super({ posX: 0, posY: 0 });
    this.type = 'explosion';
    this.crossable = true;
    this.hittable = false;
    this.color = 'transparent';
    this.parent = settings.parent;
    Object.assign(this, this.calculateProps(settings));

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

  calculateProps({ parent }: ExplosionSettings) {
    const size = parent.type === 'projectile' ? 4 : 8;
    const variant = parent.type === 'projectile' ? 'PROJECTILE_EXPLOSION' : 'TANK_EXPLOSION';
    let posX = parent.posX;
    let posY = parent.posY;

    /** Без коррекции взрыв рисуется не по центру обьекта в который попал снаряд 
    из-за несовпадения координат и разницы в размерах взрыва и обьекта. */
    const correction = parent.direction === 'UP' || parent.direction === 'LEFT' ? -2 : 0;

    if (parent.direction === 'UP' || parent.direction === 'DOWN') {
      if (parent.type === 'tank') {
        if (parent.direction === 'UP') {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === 'DOWN') {
          posX += correction - 2;
          posY += correction - 2;
        }
      } else {
        posX -= 1;
        posY += correction;
      }
    } else {
      if (parent.type === 'tank') {
        if (parent.direction === 'RIGHT') {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === 'LEFT') {
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
