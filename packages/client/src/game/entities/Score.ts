import { spriteCoordinates } from '../data/constants';
import { type ScoreVariant,EntityEvent } from '../typings';
import { type TankEnemy,Entity } from './';

type ScoreSettings = { points: number; parent: TankEnemy };

export class Score extends Entity {
  points: ScoreVariant = 100;
  /** Через сколько миллисекунд пропадёт надпись с очками */
  despawnTime = 100;

  constructor(settings: ScoreSettings) {
    super({ posX: 0, posY: 0 });
    this.type = 'score';
    this.crossable = true;
    this.hittable = false;
    this.color = 'transparent';
    Object.assign(this, this.calculateProps(settings));

    this.registerScoreEvents();
  }

  registerScoreEvents() {
    this.on(EntityEvent.Spawn, () => {
      this.setLoopDelay(() => {
        this.despawn();
      }, this.despawnTime);
    });
  }

  calculateProps({ points, parent }: ScoreSettings) {
    let mainSpriteCoordinates;

    switch (points) {
      case 500:
        mainSpriteCoordinates = spriteCoordinates['points.500'];
        break;
      case 400:
        mainSpriteCoordinates = spriteCoordinates['points.400'];
        break;
      case 300:
        mainSpriteCoordinates = spriteCoordinates['points.300'];
        break;
      case 200:
        mainSpriteCoordinates = spriteCoordinates['points.200'];
        break;
      case 100:
        mainSpriteCoordinates = spriteCoordinates['points.100'];
        break;
      default:
        mainSpriteCoordinates = null;
    }

    return {
      mainSpriteCoordinates,
      posX: parent.posX,
      posY: parent.posY,
      width: parent.width,
      height: parent.height,
    };
  }
}
