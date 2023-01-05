import { spriteCoordinates } from '../data/constants';
import { Entity, TankEnemy } from './';
import { EntityEvent } from '../typings';

type ScoreSettings = { parentEntity: TankEnemy };

export class Score extends Entity {
  constructor(props: ScoreSettings) {
    super({ posX: 0, posY: 0 });
    Object.assign(this, this.calculateProps(props.parentEntity));
    this.type = 'score';
    this.crossable = true;
    this.hittable = false;
    this.color = 'transparent';

    this.on(EntityEvent.SPAWN, () => {
      this.setLoopDelay(() => {
        this.despawn();
      }, 100);
    });
  }

  calculateProps(entity: TankEnemy) {
    let mainSpriteCoordinates;

    switch (entity.scorePoints) {
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
      default:
        mainSpriteCoordinates = spriteCoordinates['points.100'];
    }

    return {
      mainSpriteCoordinates,
      posX: entity.posX,
      posY: entity.posY,
      width: entity.width,
      height: entity.height,
    };
  }
}
