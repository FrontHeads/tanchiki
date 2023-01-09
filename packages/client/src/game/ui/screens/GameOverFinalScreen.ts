import { Screen } from './Screen';
import { spriteCoordinates } from '../../data/constants';

export class GameOverFinalScreen extends Screen {
  show() {
    const backImg = this.overlay.view.getSpriteContent(spriteCoordinates['terrain.brick'].WHOLE);
    if (!backImg) {
      return;
    }

    this.overlay.renderElement({
      posX: 0,
      posY: 22,
      width: this.overlay.view.width,
      height: 7,
      backImg,
      text: 'ПРОВАЛ',
      align: 'center',
    });
  }
}
