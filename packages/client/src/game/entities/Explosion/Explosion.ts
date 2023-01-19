import { Color } from '../../services/View/colors';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { type Projectile, type Tank, Entity } from '../';
import { Direction, EntityEvent } from '../Entity/typings';
import { type ExplosionVariant } from './typings';

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
    this.on(EntityEvent.Spawn, () => {
      this.startAnimation({
        delay: animationDelay,
        spriteCoordinates: this.mainSpriteCoordinates,
        looped: false,
      });

      // Деспаун взрыва после завершения анимации или спустя время (последнее - для тестов)
      this.on(EntityEvent.AnimationEnded, this.despawn.bind(this));
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
    const correction = parent.direction === Direction.Up || parent.direction === Direction.Left ? -2 : 0;

    if (parent.direction === Direction.Up || parent.direction === Direction.Down) {
      if (parent.type === 'tank') {
        if (parent.direction === Direction.Up) {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === Direction.Down) {
          posX += correction - 2;
          posY += correction - 2;
        }
      } else {
        posX -= 1;
        posY += correction;
      }
    } else {
      if (parent.type === 'tank') {
        if (parent.direction === Direction.Right) {
          posX += correction;
          posY += correction - 2;
        }
        if (parent.direction === Direction.Left) {
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
