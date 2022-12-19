import { EntityDynamicSettings, Pos, Rect, TankType, TankTypeOptions } from '../typings';
import { Entity, EntityDynamic, Projectile } from './';

export class Tank extends EntityDynamic {
  width = 4;
  height = 4;
  shootSpeed = 3;
  canShoot = true;
  private readonly tankType: TankTypeOptions | undefined;
  armor = 4;
  isExploding = false;

  constructor(props: EntityDynamicSettings) {
    super({ ...props, type: 'tank' });
    Object.assign(this, props);
    this.color = props.color || 'yellow';
    this.tankType = props.tankType;
    this.moveSpeed = this.getTankSpeed(this.tankType);
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
      movePace: this.getProjectileMovePace(this.tankType),
    });
    this.canShoot = false;

    projectile.on('exploding', () => {
      this.canShoot = true;
    });
    this.emit('shoot', projectile);
  }

  getTankSpeed(type?: TankTypeOptions) {
    if (type) {
      if (type === TankType.FAST) {
        return 6;
      }
      if (type === TankType.ARMOR || type === TankType.POWER) {
        return 4;
      }
    }
    return 2;
  }

  getProjectileMovePace(type?: TankTypeOptions) {
    if (type) {
      if (type === TankType.POWER || type === TankType.ARMOR) {
        return 2;
      }
    }
    return 1;
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
  explode() {
    if (!this.isExploding) {
      console.log('boom');
      if (this.tankType === TankType.BASIC && this.armor) {
        console.log('ego bron', this.armor);
        this.armor--;
      } else {
        this.emit('exploding');
        this.despawn();
      }
      setTimeout(() => {
        this.isExploding = false;
      }, 50);
    }
    this.isExploding = true;
  }

  // takeDamage(source: Entity, pos: Pos) {
  //   this.emit('damaged', pos);
  //   if (this.type === 'tank') {
  //     if (this.role !== source.role) {
  //       this.emit('destroyed', source);
  //       this.emit('exploding');
  //       if (this.tankType === TankType.BASIC && this.armor) {
  //         setTimeout(value => {
  //           console.log('ego bron', this.armor);
  //           this.armor--;
  //         }, 0);
  //         return;
  //       }
  //       this.explode();
  //     }
  //   }
  // }
}
