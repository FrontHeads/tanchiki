import { Entity } from '../entities';
import { type UIElementSettings } from '../typings';
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
      this.emit(EntityEvent.ShouldRenderText, newState);
    } else {
      this.emit(EntityEvent.ShouldUpdate, newState);
      this.emit(EntityEvent.DidUpdate, newState);
    }
  }
}
