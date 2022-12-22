import { isOdd } from '../../utils';
import { Screen } from './Screen';
export class PauseScreen extends Screen {
  show() {
    this.overlay.animate(this.animatePause.bind(this), 500);
  }
  animatePause(counter = 0) {
    const { view } = this.overlay;

    const fontSize = 5;

    const textPauseOpacity = isOdd(counter) ? 1 : 0;

    this.overlay.clearScreen();

    this.overlay.renderElement({
      posX: 0,
      posY: 0,
      width: view.width,
      height: view.height,
      color: `rgba(0,0,0,.5)`,
    });

    this.overlay.renderElement({
      posX: 0,
      posY: (view.height - fontSize) / 2,
      width: view.width,
      height: fontSize,
      text: 'ПАУЗА',
      color: `rgba(255,0,0,${textPauseOpacity})`,
      align: 'center',
    });

    return true;
  }
}
