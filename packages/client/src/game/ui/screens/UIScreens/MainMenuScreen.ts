import { Color } from '../../../services/View/colors';
import { gameTheme } from '../../../services/View/data';
import { spriteCoordinates } from '../../../services/View/spriteCoordinates';
import { isTouchscreen } from '../../../utils/isTouchscreen';
import { Screen } from '../Screen';
import { MainMenuItem } from './data';
import { GameDifficulty } from '../../../services';

export class MainMenuScreen extends Screen<MainMenuItem> {
  tankElemInterval: string | null = null;
  mainMenuStateXPos = 22;
  mainMenuStateYPos = {
    [MainMenuItem.Singleplayer]: isTouchscreen() ? 31 : 28,
    [MainMenuItem.Multiplayer]: 33,
    [MainMenuItem.Difficulty]: isTouchscreen() ? 36 : 38,
    [MainMenuItem.Style]: isTouchscreen() ? 41 : 43,
  };

  show(state: MainMenuItem) {
    const verticalCenteringCorrection = -1;

    this.render();

    const tankElem = this.overlay.renderElement({
      posX: this.mainMenuStateXPos - 6,
      posY: this.mainMenuStateYPos[state] + verticalCenteringCorrection,
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

  render() {
    const { view } = this.overlay;
    const state = this.overlay.game.state;
    const BrickBgName = gameTheme[state.themeName].brickBg;

    this.overlay.renderSplashScreen();

    this.overlay.renderElement({
      posX: 0,
      posY: 7,
      width: view.width,
      height: 7,
      backImg: this.overlay.game.resources.getImage(BrickBgName),
      text: 'ТАНЧИКИ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 16,
      width: view.width,
      height: 7,
      backImg: this.overlay.game.resources.getImage(BrickBgName),
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
