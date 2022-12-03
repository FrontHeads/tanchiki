import { Entity } from '../entities';
import { UIElementSettings } from '../typings';

export class UIElement extends Entity {
  text = '';
  align: CanvasTextAlign = 'left';
  img: HTMLImageElement | null = null;

  constructor(props: UIElementSettings) {
    super(props);
    this.type = 'custom';
    Object.assign(this, props);
  }

  render() {
    const newState = { posX: this.posX, posY: this.posY };
    if (this.text) {
      this.emit('entityShouldRenderText', newState);
    } else {
      this.emit('entityShouldUpdate', newState);
      this.emit('entityDidUpdate', newState);
    }
  }
}
