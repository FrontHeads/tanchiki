import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { EntityEvent } from '../Entity/typings';
import { Speed } from '../EntityDynamic/data';
import { type EntityDynamicSettings } from '../EntityDynamic/typings';
import { Tank } from './Tank';
import { type PlayerVariant } from './typings';

export class TankPlayer extends Tank {
  variant: PlayerVariant = 'PLAYER1';
  /** Сколько танк будет неуязвимым после появления. */
  spawnShieldTimeout = 3000;
  /** Уровень улучшений танка (увеличивается за счёт бонусов). */
  upgradeTier = 1;

  constructor(props: EntityDynamicSettings) {
    super(props);
    this.role = 'player';
    this.setMoveSpeed(Speed.Medium);
    this.setShootSpeed(Speed.Medium);
    Object.assign(this, props);

    if (this.variant === 'PLAYER1') {
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
    // Возвращаем танку уязимость после исчезновения силового поля.
    this.setLoopDelay(() => {
      this.invincible = false;
    }, timeout);
  }

  upgrade() {
    ++this.upgradeTier;

    if (this.upgradeTier === 2) {
      this.mainSpriteCoordinates = (this.variant === 'PLAYER1') ?
        spriteCoordinates['tank.player.primary.b'] : spriteCoordinates['tank.player.secondary.b'];
      this.setShootSpeed(Speed.High);
    } else if (this.upgradeTier === 3) {
      this.mainSpriteCoordinates = (this.variant === 'PLAYER1') ?
        spriteCoordinates['tank.player.primary.c'] : spriteCoordinates['tank.player.secondary.c'];
      this.projectilesLimit = 2;
    } else if (this.upgradeTier >= 4) {
      this.mainSpriteCoordinates = (this.variant === 'PLAYER1') ?
        spriteCoordinates['tank.player.primary.d'] : spriteCoordinates['tank.player.secondary.d'];
      this.shootForce = 2;
    }
  }
}
