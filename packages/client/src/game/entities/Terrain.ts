import { spriteCoordinates } from '../data/constants';
import { EntityEvent, EntitySettings, TerrainVariant } from '../typings';
import { Entity } from './';

export class Terrain extends Entity {
  variant: TerrainVariant = 'WHOLE';

  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.role = 'neutral';
    switch (this.type) {
      case 'boundary':
        this.crossable = false;
        this.hittable = true;
        this.color = 'grey';
        break;
      case 'brickWall':
        this.crossable = false;
        this.hittable = true;
        this.color = 'brown';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.brick'][this.variant];
        break;
      case 'concreteWall':
        this.crossable = false;
        this.hittable = true;
        this.color = 'lightgrey';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.concrete'][this.variant];
        break;
      case 'trees':
        this.crossable = true;
        this.hittable = false;
        this.color = 'green';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.trees'];
        break;
      case 'water':
        this.crossable = false;
        this.hittable = false;
        this.color = 'blue';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.water'];
        break;
      case 'ice':
        this.crossable = true;
        this.hittable = false;
        this.color = 'aliceblue';
        this.mainSpriteCoordinates = spriteCoordinates['terrain.ice'];
        break;
    }

    if (this.type === 'water') {
      this.on(EntityEvent.SPAWN, () => {
        this.startAnimation({
          delay: 350,
          spriteCoordinates: spriteCoordinates['terrain.water'],
          looped: true,
        });
      });
    }
  }
}
