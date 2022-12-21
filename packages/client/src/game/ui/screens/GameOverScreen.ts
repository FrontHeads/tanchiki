import { Screen } from './Screen';

export class GameOverScreen extends Screen {
  show() {
    this.overlay.animate(this.updateStage.bind(this));
  }

  updateStage(stage = 0) {
    const { view } = this.overlay;
    const fontSize = 5;
    const posY = view.height - stage;
    const middle = (view.height - fontSize) / 2;

    if (posY < middle) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderElement({
      posX: 0,
      posY,
      width: view.width,
      height: fontSize,
      text: 'ПОТРАЧЕНО',
      color: 'red',
      align: 'center',
    });

    return true;
  }
}
