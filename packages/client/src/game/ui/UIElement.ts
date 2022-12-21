import { Entity } from '../entities';
import { UIElementSettings } from '../typings';
import { EntityEvent } from './../typings/index';

export class UIElement extends Entity {
  text = '';
  align: CanvasTextAlign = 'left';
  backImg: HTMLImageElement | null = null;

  constructor(props: UIElementSettings) {
    super(props);
    this.type = 'custom';
    Object.assign(this, props);
  }

  render() {
    const newState = { posX: this.posX, posY: this.posY };
    if (this.text) {
      this.emit(EntityEvent.ENTITY_SHOULD_RENDER_TEXT, newState);
    } else {
      this.emit(EntityEvent.ENTITY_SHOULD_UPDATE, newState);
      this.emit(EntityEvent.ENTITY_DID_UPDATE, newState);
    }
  }
}
