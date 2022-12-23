import { LevelSelectorScreenProps } from './LevelSelectorScreen.typings';
import { Screen } from './Screen';

export class LevelSelectorScreen extends Screen<LevelSelectorScreenProps> {
  show({ level, showHints = true }: LevelSelectorScreenProps) {
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

    if (showHints) {
      this.overlay.renderElement({
        posX: 0,
        posY: 50,
        width: this.overlay.view.width,
        height: 1,
        color: 'black',
        text: 'ДЛЯ ВЫБОРА УРОВНЯ ВОСПОЛЬЗУЙТЕСЬ',
        align: 'center',
      });

      this.overlay.renderElement({
        posX: 0,
        posY: 52,
        width: this.overlay.view.width,
        height: 1,
        color: 'black',
        text: 'СТРЕЛКАМИ ВВЕРХ И ВНИЗ',
        align: 'center',
      });
    }
  }
}
