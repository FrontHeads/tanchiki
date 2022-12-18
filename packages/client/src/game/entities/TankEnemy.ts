import { spriteCoordinates } from '../data/constants';
import { Direction, EntityDynamicSettings } from '../typings';
import { Tank } from './Tank';

export class TankEnemy extends Tank {
  width = 4;
  height = 4;
  shootSpeed = 3;
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = false;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.color = 'aqua';
    Object.assign(this, props);
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.enemy.default.a'];

    const moveInternval = setInterval(() => {
      this.move(this.getMoveDirection());
    }, 1000);

    const shootInternval = setInterval(() => {
      this.shoot();
    }, 1000);

    this.on('entityShouldBeDestroyed', () => {
      clearInterval(moveInternval);
      clearInterval(shootInternval);
    });
  }

  getMoveDirection() {
    const rand = Math.floor(Math.random() * Object.keys(Direction).length);
    const randValue = Object.keys(Direction)[rand];
    return Direction[randValue as keyof typeof Direction];
  }
}
