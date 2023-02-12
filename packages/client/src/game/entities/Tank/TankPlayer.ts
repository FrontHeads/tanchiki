import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { EntityEvent } from '../Entity/typings';
import { Speed } from '../EntityDynamic/data';
import { type PlayerVariant, type TankPlayerSettings } from './typings';
import { Tank } from './Tank';

export { type PlayerVariant, type TankPlayerSettings };

export class TankPlayer extends Tank {
  variant: PlayerVariant = 'PLAYER1';
  /** Сколько танк будет неуязвимым после появления. */
  spawnShieldTimeout = 3000;
  /** Уровень улучшений танка (увеличивается за счёт бонусов). */
  upgradeTier = 1;

  constructor(props: TankPlayerSettings) {
    super({ posX: 0, posY: 0 });
    this.role = 'player';
    Object.assign(this, props);

    this.updateTankSpecs();
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
    this.updateTankSpecs();
  }

  updateTankSpecs() {
    const isPlayerOne = this.variant === 'PLAYER1';

    // Апгрейды танка
    if (this.upgradeTier >= 1) {
      this.setMoveSpeed(Speed.Medium);
      this.setShootSpeed(Speed.Medium);
      this.mainSpriteCoordinates = isPlayerOne
        ? spriteCoordinates['tank.player.primary.a']
        : spriteCoordinates['tank.player.secondary.a'];
    }
    if (this.upgradeTier >= 2) {
      // Увеличение скорости стрельбы
      this.setShootSpeed(Speed.High);
      this.mainSpriteCoordinates = isPlayerOne
        ? spriteCoordinates['tank.player.primary.b']
        : spriteCoordinates['tank.player.secondary.b'];
    }
    if (this.upgradeTier >= 3) {
      // Увеличение лимита выпускаемых за раз снарядов
      this.projectilesLimit = 2;
      this.mainSpriteCoordinates = isPlayerOne
        ? spriteCoordinates['tank.player.primary.c']
        : spriteCoordinates['tank.player.secondary.c'];
    }
    if (this.upgradeTier >= 4) {
      // Увеличение силы взрыва снарядов (лучше пробивает стены)
      this.shootForce = 2;
      this.mainSpriteCoordinates = isPlayerOne
        ? spriteCoordinates['tank.player.primary.d']
        : spriteCoordinates['tank.player.secondary.d'];
    }

    this.refreshSprite();
  }
}
