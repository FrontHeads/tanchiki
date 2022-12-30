import { spriteCoordinates } from '../data/constants';
import { type EntityDynamicSettings, EntityEvent, Speed } from '../typings';
import { Tank } from './Tank';

export class TankPlayer extends Tank {
  /** Дает танку неуязвимость (снаряды не причиняют вреда) */
  invincible = true;
  shieldTimeout = 3000;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.role = 'player';
    this.setMoveSpeed(Speed.Medium);
    this.setShootSpeed(Speed.Medium);
    Object.assign(this, props);
    //TODO выбор спрайта танка должен зависеть от роли (игрок1/игрок2/противник) и типа танка (большой/маленький)
    this.mainSpriteCoordinates = spriteCoordinates['tank.player.primary.a'];

    this.on(EntityEvent.SPAWN, () => {
      this.setLoopDelay(
        this.startAnimation.bind(this, {
          delay: 50,
          spriteCoordinates: spriteCoordinates.shield,
          looped: true,
          stopTimer: this.shieldTimeout,
          showMainSprite: true,
        }),
        this.spawnTimeout
      );

      // Возвращаем танку уязимость после исчезновения силового поля после спауна.
      this.setLoopDelay(() => {
        this.invincible = false;
      }, this.spawnTimeout + this.shieldTimeout);
    });
  }
}
