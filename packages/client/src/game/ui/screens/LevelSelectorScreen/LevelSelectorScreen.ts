import { Color } from '../../../data/colors';
import { Screen } from '../Screen/Screen';
import { type LevelSelectorScreenProps } from './typings';

export class LevelSelectorScreen extends Screen<LevelSelectorScreenProps> {
  show({ level, showHints = true }: LevelSelectorScreenProps) {
    this.overlay.renderSplashScreen(Color.Grey);
    const text = `УРОВЕНЬ ${level.toString().padStart(2, ' ')}`;

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
        height: 1,
        color: Color.Black,
        text: 'ДЛЯ ВЫБОРА УРОВНЯ ВОСПОЛЬЗУЙТЕСЬ',
        align: 'center',
      });

      this.overlay.renderElement({
        posX: 0,
        posY: 52,
        width: this.overlay.view.width,
        height: 1,
        color: Color.Black,
        text: 'СТРЕЛКАМИ ВВЕРХ И ВНИЗ',
        align: 'center',
      });
    }
  }
}
