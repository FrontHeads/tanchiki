import { spriteCoordinates } from '../data/constants';
import type { EntityDynamicSettings, Rect } from '../typings';
import { EntityDynamic, Projectile } from './';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  shootSpeed = 3;
  canShoot = false;
  /** Временно блокирует возможность перемещения (например на время анимации спауна). */
  frozen = true;
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = true;

  constructor(props: EntityDynamicSettings) {
    super({ ...props, type: 'tank' });
    Object.assign(this, props);
    this.color = props.color || 'yellow';
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.player.primary.a'];

    this.on('spawn', () => {
      const spawnTimeout = 1000;
      const shieldTimeout = 3000;

      this.startAnimation({
        delay: 50,
        spriteCoordinates: spriteCoordinates.spawn,
        looped: true,
        stopTimer: spawnTimeout,
      });

      // Возвращаем танку подвижность после анимации спауна.
      this.setLoopDelay(() => {
        this.frozen = false;
        this.canShoot = true;
      }, spawnTimeout);

      if (this.role === 'player') {
        this.setLoopDelay(
          this.startAnimation.bind(this, {
            delay: 25,
            spriteCoordinates: spriteCoordinates.shield,
            looped: true,
            stopTimer: shieldTimeout,
            showMainSprite: true,
          }),
          spawnTimeout
        );

        // Возвращаем танку уязимость после исчезновения силового поля после спауна.
        this.setLoopDelay(() => {
          this.invincible = false;
        }, spawnTimeout + shieldTimeout);
      }
    });
  }

  shoot() {
    if (!this.spawned || !this.canShoot) {
      return;
    }

    const projectile = new Projectile({
      parent: this,
      ...this.calculateProjectileInitPos(),
      role: this.role,
      direction: this.direction,
      moveSpeed: this.shootSpeed,
    });
    this.canShoot = false;

    projectile.on('exploding', () => {
      this.canShoot = true;
    });

    this.emit('shoot', projectile);
  }

  calculateProjectileInitPos() {
    const defaultSize = { width: 2, height: 2 };
    let rect: Rect;
    if ((this.moving || this.stopping) && this.canMove && this.nextRect) {
      rect = this.nextRect;
    } else {
      rect = this.getRect();
    }
    const offsetX = Math.round((rect.width - defaultSize.width) / 2);
    const offsetY = Math.round((rect.height - defaultSize.height) / 2);

    switch (this.direction) {
      case 'UP':
        return { posX: rect.posX + offsetX, posY: rect.posY };
      case 'DOWN':
        return { posX: rect.posX + offsetX, posY: rect.posY + rect.height - defaultSize.height };
      case 'LEFT':
        return { posX: rect.posX, posY: rect.posY + offsetY };
      case 'RIGHT':
        return { posX: rect.posX + rect.width - defaultSize.width, posY: rect.posY + offsetY };
      default:
        return { posX: rect.posX, posY: rect.posY }; // чтобы не ругался тайпскрипт (из-за enum Direction)
    }
  }
}
