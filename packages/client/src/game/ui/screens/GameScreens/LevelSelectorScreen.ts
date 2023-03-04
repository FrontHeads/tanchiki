import { Color } from '../../../services/View/colors';
import { isTouchscreen } from '../../../utils/isTouchscreen';
import { Screen } from '../Screen';
import { type LevelSelectorScreenProps } from './typings';

export class LevelSelectorScreen extends Screen<LevelSelectorScreenProps> {
  show({ level, showHints = true }: LevelSelectorScreenProps) {
    const state = this.overlay.game.state;
    const text = `УРОВЕНЬ ${level.toString().padStart(2, ' ')}`;

    this.overlay.renderSplashScreen(Color.Grey);

    this.overlay.renderElement({
      posX: 0,
      posY: 3,
      width: this.overlay.view.width,
      height: 1.5,
      color: Color.LightGrey,
      text: !state.username ? 'ЗАЛОГИНЬСЯ, ЧТОБЫ ПОПАСТЬ В ТОП ИГРОКОВ' : ' ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: Math.round(this.overlay.view.height / 2) - 2,
      width: this.overlay.view.width,
      height: 2,
      color: Color.Black,
      text: text,
      align: 'center',
    });

    if (showHints) {
      this.overlay.renderElement({
        posX: 0,
        posY: 50,
        width: this.overlay.view.width,
        height: isTouchscreen() ? 1.5 : 1,
        color: Color.Black,
        text: 'ДЛЯ ВЫБОРА УРОВНЯ ВОСПОЛЬЗУЙТЕСЬ',
        align: 'center',
      });

      this.overlay.renderElement({
        posX: 0,
        posY: isTouchscreen() ? 52.7 : 52,
        width: this.overlay.view.width,
        height: isTouchscreen() ? 1.5 : 1,
        color: Color.Black,
        text: 'СТРЕЛКАМИ ВВЕРХ/ВПРАВО И ВНИЗ/ВЛЕВО',
        align: 'center',
      });
    }
  }
}
