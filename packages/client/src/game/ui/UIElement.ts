import { Entity } from '../entities';
import { UIElementSettings } from '../typings';

export class UIElement extends Entity {
  text = '';
  align: CanvasTextAlign = 'left';

  constructor(props: UIElementSettings) {
    super(props);
    this.type = 'custom';
    this.text = props.text ?? this.text;
    this.align = props.align ?? this.align;
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
