import { resources } from '../../../services';
import { Color } from '../../../services/View/colors';
import { spriteCoordinates } from '../../../services/View/spriteCoordinates';
import { isOdd } from '../../../utils';
import { isTouchscreen } from '../../../utils/isTouchscreen';
import { type UIElement } from '../../UIElement/UIElement';
import { Screen } from '../Screen';
import { MainMenuState } from './data';

export class MainMenuScreen extends Screen<MainMenuState> {
  tankElemInterval: string | null = null;
  mainMenuStateYPos = {
    [MainMenuState.Singleplayer]: isTouchscreen() ? 38 : 32,
    [MainMenuState.Multiplayer]: 37,
  };
  menuFirstElem: UIElement | null = null;

  show(state: MainMenuState) {
    const verticalCenteringCorrection = -1;

    if (isTouchscreen()) {
      state = MainMenuState.Singleplayer;
      if (!this.menuFirstElem) {
        this.overlay.animate(this.animateMenuFirstElem, 500);
      }
    }

    this.render();

    const tankElem = this.overlay.renderElement({
      posX: 17,
      posY: this.mainMenuStateYPos[state] + verticalCenteringCorrection,
      width: 4,
      height: 4,
      color: Color.Yellow,
      mainSpriteCoordinates: spriteCoordinates['tank.player.primary.a'].RIGHT,
    });

    /**Запуск анимации танка-курсора в меню.*/
    tankElem.startAnimation({
      delay: 25,
      spriteCoordinates: spriteCoordinates['tank.player.primary.a'].RIGHT,
      name: 'menuTank',
      looped: true,
    });
  }

  render() {
    const { view } = this.overlay;

    this.overlay.renderSplashScreen();

    this.overlay.renderElement({
      posX: 0,
      posY: 12,
      width: view.width,
      height: 7,
      backImg: resources.getImage('brickBg'),
      text: 'ТАНЧИКИ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 21,
      width: view.width,
      height: 7,
      backImg: resources.getImage('brickBg'),
      text: '2023',
      align: 'center',
    });

    this.menuFirstElem = this.overlay.renderElement({
      posX: 23,
      posY: this.mainMenuStateYPos[MainMenuState.Singleplayer],
      width: 24,
      height: 2.2,
      color: Color.White,
      text: isTouchscreen() ? 'НАЖМИ ОГОНЬ' : '1 ИГРОК',
    });

    if (!isTouchscreen()) {
      this.overlay.renderElement({
        posX: 23,
        posY: this.mainMenuStateYPos[MainMenuState.Multiplayer],
        width: 20,
        height: 2.2,
        color: Color.White,
        text: '2 ИГРОКА',
      });
    }

    this.overlay.renderElement({
      posX: 0,
      posY: 50,
      width: view.width,
      height: isTouchscreen() ? 1.5 : 1,
      color: Color.LightGrey,
      text: isTouchscreen() ? 'ДЖОЙСТИК ДЛЯ ДВИЖЕНИЯ' : 'WASD ИЛИ СТРЕЛКИ ДЛЯ ДВИЖЕНИЯ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: isTouchscreen() ? 52.7 : 52,
      width: view.width,
      height: isTouchscreen() ? 1.5 : 1,
      color: Color.LightGrey,
      text: isTouchscreen() ? 'ОГОНЬ ДЛЯ ВЫБОРА В МЕНЮ И СТРЕЛЬБЫ' : 'ПРОБЕЛ ИЛИ ВВОД ДЛЯ СТРЕЛЬБЫ',
      align: 'center',
    });
  }

  animateMenuFirstElem = (counter = 0) => {
    const opacity = isOdd(counter) ? 0 : 1;

    /** Убираем анимацию при уходе с экрана главного меню */
    if (this.overlay.game.screen !== 'MAIN_MENU') {
      return false;
    }

    if (this.menuFirstElem) {
      this.menuFirstElem.color = `rgba(255,255,255,${opacity ?? 1})`;
      this.overlay.refreshTextEntity(this.menuFirstElem);
    }

    return true;
  };
}
