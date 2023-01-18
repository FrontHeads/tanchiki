import { spriteCoordinates } from '../../data/spriteCoordinates';
import { type EntityDynamicSettings, EntityEvent } from '../../typings';
import { Speed } from './data';
import { Tank } from './Tank';
import { type PlayerVariant } from './typings';

export class TankPlayer extends Tank {
  spawnShieldTimeout = 3000;
  variant: PlayerVariant = 'PLAYER1';

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.role = 'player';
    this.setMoveSpeed(Speed.Medium);
    this.setShootSpeed(Speed.Medium);
    Object.assign(this, props);

    //TODO выбор спрайта танка также должен зависеть от типа танка (большой/маленький)
    if (!props.variant || props.variant === 'PLAYER1') {
      this.mainSpriteCoordinates = spriteCoordinates['tank.player.primary.a'];
    } else {
      this.mainSpriteCoordinates = spriteCoordinates['tank.player.secondary.a'];
    }

    this.registerTankPlayerEvents();
  }

  registerTankPlayerEvents() {
    this.on(EntityEvent.Ready, () => {
      this.useShield(this.spawnShieldTimeout);
    });
  }

  useShield(timeout: number) {
    this.startAnimation({
      delay: 50,
      spriteCoordinates: spriteCoordinates.shield,
      looped: true,
      stopTimer: timeout,
      showMainSprite: true,
    });

    this.invincible = true;
    // Возвращаем танку уязимость после исчезновения силового поля после спауна.
    this.setLoopDelay(() => {
      this.invincible = false;
    }, timeout);
  }
}
