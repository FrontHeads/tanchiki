import { Color } from '../../data/colors';
import { spriteCoordinates } from '../../data/spriteCoordinates';
import type { EntitySettings } from '../../typings';
import { Entity } from '../';
import { EntityEvent } from './../../typings/index';

export class Flag extends Entity {
  destroyed = false;

  constructor(props: EntitySettings) {
    super(props);
    Object.assign(this, props);
    this.type = 'flag';
    this.color = Color.White;
    this.crossable = false;
    this.hittable = true;
    this.mainSpriteCoordinates = spriteCoordinates['base.heart.alive'];

    this.registerFlagEvents();
  }

  registerFlagEvents() {
    this.on(EntityEvent.Damaged, ({ source }) => {
      if (!this.destroyed) {
        this.mainSpriteCoordinates = spriteCoordinates['base.heart.dead'];
        this.refreshSprite();
        this.emit(EntityEvent.Destroyed, source);
        this.destroyed = true;
      }
    });
  }
}
