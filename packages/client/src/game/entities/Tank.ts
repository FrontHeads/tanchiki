import type { RectT } from '../typings';
import { EntityDynamic, Projectile } from './';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  shootSpeed = 3;

  constructor(props: Partial<EntityDynamic>) {
    super(props);
    Object.assign(this, props);
    this.color = props.color || 'yellow';
  }
  shoot() {
    const projectile = new Projectile({ direction: this.direction, shootSpeed: this.shootSpeed });
    Object.assign(projectile, this.calculateProjectilePos(projectile));
    return projectile;
  }
  calculateProjectilePos(projectile: Projectile) {
    let rect: RectT;
    if (this.moving || this.stopping) {
      rect = this.nextRect;
    } else {
      rect = this.getRect();
    }
    const offsetX = Math.round((rect.width - projectile.width) / 2);
    const offsetY = Math.round((rect.height - projectile.height) / 2);

    switch (this.direction) {
      case 'UP':
        return { posX: rect.posX + offsetX, posY: rect.posY - projectile.height };
      case 'DOWN':
        return { posX: rect.posX + offsetX, posY: rect.posY + rect.height };
      case 'LEFT':
        return { posX: rect.posX - projectile.width, posY: rect.posY + offsetY };
      case 'RIGHT':
        return { posX: rect.posX + rect.width, posY: rect.posY + offsetY };
    }
  }
}
