import { isOdd } from '../../../utils';
import { Screen } from '../Screen/Screen';

export class PausePopupScreen extends Screen {
  show() {
    /**Рендерим паузу один раз без задержки с opacity: 1*/
    this.showPause(1);
    this.overlay.animate(this.animatePause.bind(this), 500);
  }

  animatePause(counter = 0) {
    const textPauseOpacity = isOdd(counter) ? 0 : 1;
    this.overlay.clearScreen();

    //** Убироаем анимацию при снятии паузы */
    if (!this.overlay.game.paused) {
      return false;
    }
    this.showPause(textPauseOpacity);

    return true;
  }

  showPause(textPauseOpacity?: number) {
    const { view } = this.overlay;
    const fontSize = 5;

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
  }
}
