import { Color } from '../data/colors';
import { spriteCoordinates } from '../data/constants';
import { Direction, EntityEvent, ExplosionVariant } from '../typings';
import { Entity, Projectile, Tank } from './';

type ExplosionSettings = { parent: Tank | Projectile };

export class Explosion extends Entity {
  variant: ExplosionVariant = 'PROJECTILE_EXPLOSION';
  parent: ExplosionSettings['parent'];
  despawnTime = 200;

  constructor(settings: ExplosionSettings) {
    super({ posX: 0, posY: 0 });
    this.type = 'explosion';
    this.crossable = true;
    this.hittable = false;
    this.color = Color.Transparent;
    this.parent = settings.parent;
    Object.assign(this, this.calculateProps(settings));

    let animationDelay = 0;
    switch (this.variant) {
      case 'PROJECTILE_EXPLOSION':
        this.mainSpriteCoordinates = spriteCoordinates.projectileExplosion;
        break;
      case 'TANK_EXPLOSION':
        this.mainSpriteCoordinates = spriteCoordinates.tankExplosion;
        animationDelay = 16; // для более красивой отрисовки взрыва танка нужна задержка
        break;
    }

    this.registerExplosionEvents({ animationDelay });
  }

  registerExplosionEvents({ animationDelay }: { animationDelay: number }) {
    this.on(EntityEvent.SPAWN, () => {
      this.startAnimation({
        delay: animationDelay,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });

      // Деспаун взрыва после завершения анимации или спустя время (последнее - для тестов)
      this.on(EntityEvent.ANIMATION_ENDED, this.despawn.bind(this));
      this.setLoopDelay(this.despawn.bind(this), this.despawnTime);
    });
  }

  calculateProps({ parent }: ExplosionSettings) {
    const size = parent.type === 'projectile' ? 4 : 8;
    const variant = parent.type === 'projectile' ? 'PROJECTILE_EXPLOSION' : 'TANK_EXPLOSION';
    let posX = parent.posX;
    let posY = parent.posY;

    /** Без коррекции взрыв рисуется не по центру обьекта в который попал снаряд 
    из-за несовпадения координат и разницы в размерах взрыва и обьекта. */
    const correction = parent.direction === Direction.UP || parent.direction === Direction.LEFT ? -2 : 0;

    if (parent.direction === Direction.UP || parent.direction === Direction.DOWN) {
      if (parent.type === 'tank') {
        if (parent.direction === Direction.UP) {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === Direction.DOWN) {
          posX += correction - 2;
          posY += correction - 2;
        }
      } else {
        posX -= 1;
        posY += correction;
      }
    } else {
      if (parent.type === 'tank') {
        if (parent.direction === Direction.RIGHT) {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === Direction.LEFT) {
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
