import { GameDifficulty } from '../../../services';
import { Color } from '../../../services/View/colors';
import { gameTheme } from '../../../services/View/data';
import { spriteCoordinates } from '../../../services/View/spriteCoordinates';
import { isTouchscreen } from '../../../utils/isTouchscreen';
import { Screen } from '../Screen';
import { MainMenuItem } from './data';

export class MainMenuScreen extends Screen<MainMenuItem> {
  tankElemInterval: string | null = null;
  mainMenuStateXPos = 19;

  mainMenuStateYPos = {
    [MainMenuItem.Singleplayer]: 28,
    [MainMenuItem.Multiplayer]: isTouchscreen() ? 0 : 33,
    [MainMenuItem.JoystickType]: isTouchscreen() ? 33 : 0,
    [MainMenuItem.Difficulty]: 38,
    [MainMenuItem.Style]: 43,
  };

  show(menuItem: MainMenuItem) {
    const verticalCenteringCorrection = -1;

    this.render(menuItem);

    const tankElem = this.overlay.renderElement({
      posX: this.mainMenuStateXPos - 6,
      posY: this.mainMenuStateYPos[menuItem] + verticalCenteringCorrection,
      width: 4,
      height: 4,
      color: Color.Yellow,
      backColor: Color.Black,
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

  render(menuItem: MainMenuItem) {
    const { view } = this.overlay;
    const state = this.overlay.game.state;
    const brickBgName = gameTheme[state.themeName].brickBg;

    this.overlay.renderSplashScreen();

    this.overlay.renderElement({
      posX: 0,
      posY: 7,
      width: view.width,
      height: 7,
      backImg: this.overlay.game.resources.getImage(brickBgName),
      text: 'ТАНЧИКИ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 16,
      width: view.width,
      height: 7,
      backImg: this.overlay.game.resources.getImage(brickBgName),
      text: '2023',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: this.mainMenuStateXPos,
      posY: this.mainMenuStateYPos[MainMenuItem.Singleplayer],
      width: 24,
      height: 2.2,
      color: Color.White,
      text: isTouchscreen() ? 'СТАРТ' : '1 ИГРОК',
    });

    this.overlay.renderElement({
      posX: this.mainMenuStateXPos + 17,
      posY: this.mainMenuStateYPos[MainMenuItem.Singleplayer] + 0.6,
      width: view.width,
      height: 1,
      color: Color.LightGrey,
      text: menuItem === MainMenuItem.Singleplayer && state.username ? `(${state.username})` : ' ',
    });

    if (!isTouchscreen()) {
      this.overlay.renderElement({
        posX: this.mainMenuStateXPos,
        posY: this.mainMenuStateYPos[MainMenuItem.Multiplayer],
        width: 20,
        height: 2.2,
        color: Color.White,
        text: '2 ИГРОКА',
      });
    }

    this.overlay.renderElement({
      posX: this.mainMenuStateXPos,
      posY: this.mainMenuStateYPos[MainMenuItem.Difficulty],
      width: 24,
      height: 2.2,
      color: Color.White,
      text: 'ВРАГИ: ' + (state.difficulty === GameDifficulty.Easy ? 'ПРОСТЫЕ' : 'СЛОЖНЫЕ'),
    });

    this.overlay.renderElement({
      posX: this.mainMenuStateXPos,
      posY: this.mainMenuStateYPos[MainMenuItem.Style],
      width: 24,
      height: 2.2,
      color: Color.White,
      text: 'СТИЛЬ: ' + gameTheme[state.themeName].menuTitle,
    });

    if (isTouchscreen()) {
      this.overlay.renderElement({
        posX: this.mainMenuStateXPos,
        posY: this.mainMenuStateYPos[MainMenuItem.JoystickType],
        width: 22,
        height: 2.2,
        color: Color.White,
        text: 'УПРАВЛЕНИЕ: ' + state.joystickType,
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
}
