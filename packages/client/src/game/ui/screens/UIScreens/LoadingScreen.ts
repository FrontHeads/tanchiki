import { Color } from '../../../services/View/colors';
import { Screen } from '../Screen';

export class LoadingScreen extends Screen {
  show() {
    this.overlay.renderSplashScreen();
    this.overlay.renderElement({
      posX: 0,
      posY: 26,
      width: this.overlay.view.width,
      height: 4,
      color: Color.White,
      text: 'ЗАГРУЗКА...',
      align: 'center',
    });
  }
}
