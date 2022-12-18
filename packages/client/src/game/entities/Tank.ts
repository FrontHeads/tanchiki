import type { EntityDynamicSettings, Rect } from '../typings';
import { EntityDynamic, Projectile } from './';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  shootSpeed = 3;
  canShoot = true;

  constructor(props: EntityDynamicSettings) {
    super({ ...props, type: 'tank' });
    Object.assign(this, props);
    this.color = props.color || 'yellow';
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
