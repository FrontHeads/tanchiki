import { type PowerupVariant } from './typings';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { EntityEvent } from '../Entity/typings';
import { Entity } from '../';
import { rand } from '../../utils';

const powerupVariants: PowerupVariant[] = ['STAR', 'TANK', 'HELMET', 'GRENADE', 'SHOVEL', 'CLOCK'];

export class Powerup extends Entity {
  width = 4;
  height = 4;
  variant: PowerupVariant = 'STAR';

  constructor() {
    super({ posX: 0, posY: 0 });
    this.type = 'powerup';
    this.variant = this.getRandomVariant();
    this.crossable = true;
    this.hittable = false;
    this.color = 'transparent';

    switch (this.variant) {
      case 'STAR':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.star'];
        break;
      case 'TANK':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.tank'];
        break;
      case 'HELMET':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.helmet'];
        break;
      case 'GRENADE':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.grenade'];
        break;
      case 'SHOVEL':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.shovel'];
        break;
      case 'CLOCK':
        this.mainSpriteCoordinates = spriteCoordinates['powerup.clock'];
        break;
    }

    this.registerPowerupEvents();
  }

  getRandomVariant() {
    return powerupVariants[Math.floor(Math.random() * powerupVariants.length)];
  }

  registerPowerupEvents() {
    this.on(EntityEvent.Spawn, () => {
      const tempSpriteCoordinates = this.mainSpriteCoordinates;
      const flashingIntervalMs = 200;
      const flashingIntervalName = 'flashing' + rand(0, 999999);

      this.setLoopInterval(
        () => {
          if (this.mainSpriteCoordinates) {
            this.mainSpriteCoordinates = null;
          } else {
            this.mainSpriteCoordinates = tempSpriteCoordinates;
          }
          this.refreshSprite();
        },
        flashingIntervalMs,
        flashingIntervalName
      );
    });
  }
}
