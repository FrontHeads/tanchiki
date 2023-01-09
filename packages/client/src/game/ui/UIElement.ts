import { Entity } from '../entities';
import { UIElementSettings } from '../typings';
import { EntityEvent } from './../typings/index';

export class UIElement extends Entity {
  text = '';
  align: CanvasTextAlign = 'left';
  backImg: HTMLImageElement | HTMLCanvasElement | null = null;
  spawned = true;
  indicatorName = '';

  constructor(props: UIElementSettings) {
    super(props);
    this.type = props.indicatorName ? 'indicator' : 'custom';
    Object.assign(this, props);
  }

  render() {
    const newState = { posX: this.posX, posY: this.posY };
    if (this.text) {
      this.emit(EntityEvent.SHOULD_RENDER_TEXT, newState);
    } else {
      this.emit(EntityEvent.SHOULD_UPDATE, newState);
      this.emit(EntityEvent.DID_UPDATE, newState);
    }
  }
}
