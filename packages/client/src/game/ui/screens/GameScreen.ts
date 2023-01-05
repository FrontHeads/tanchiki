import { Color } from '../../data/constants';
import { Screen } from './Screen';

export class GameScreen extends Screen<number> {
  show(startAnimationDelay = 0) {
    setTimeout(() => {
      this.overlay.animate(this.updateStage.bind(this));
    }, startAnimationDelay);
  }

  updateStage(stage = 0) {
    const { view } = this.overlay;
    const width = view.width;
    const height = Math.round(view.height / 2) - stage;

    if (height < 0) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderElement({
      posX: 0,
      posY: 0,
      width,
      height,
      color: Color.Grey,
    });
    this.overlay.renderElement({
      posX: 0,
      posY: height + stage * 2,
      width,
      height,
      color: Color.Grey,
    });

    return true;
  }
}
