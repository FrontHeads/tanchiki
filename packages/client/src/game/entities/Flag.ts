import { Color, spriteCoordinates } from '../data/constants';
import type { EntitySettings } from '../typings';
import { EntityEvent } from './../typings/index';
import { Entity } from './';

export class Flag extends Entity {
  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'flag';
    this.color = Color.White;
    this.crossable = false;
    this.hittable = true;
    this.mainSpriteCoordinates = spriteCoordinates['base.heart.alive'];

    this.on(EntityEvent.DAMAGED, () => {
      this.mainSpriteCoordinates = spriteCoordinates['base.heart.dead'];
      this.refreshSprite();
    });
  }
}
