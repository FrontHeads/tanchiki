import { Screen } from './';

export class LevelSelectorScreen extends Screen<number> {
  show(level: number) {
    this.overlay.renderSplashScreen('grey');
    const text = `УРОВЕНЬ ${level.toString().padStart(2, ' ')}`;

    this.overlay.renderElement({
      posX: 0,
      posY: Math.round(this.overlay.view.height / 2) - 2,
      width: this.overlay.view.width,
      height: 2,
      color: 'black',
      text: text,
      align: 'center',
    });
  }
}
