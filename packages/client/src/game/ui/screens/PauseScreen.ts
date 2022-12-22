import { Screen } from './Screen';

export class PauseScreen extends Screen {
  show() {
    const { view } = this.overlay;
    const fontSize = 5;

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
      color: 'red',
      align: 'center',
    });
  }
}
