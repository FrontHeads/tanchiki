import { spriteCoordinates } from '../../data/constants';
import { resources } from '../../services';
import { MainMenuState } from '../../typings';
import { Screen } from './Screen';

export class MainMenuScreen extends Screen<MainMenuState> {
  tankElemInterval: string | null = null;
  mainMenuStateYPos = {
    [MainMenuState.SINGLEPLAYER]: 32,
    [MainMenuState.MULTIPLAYER]: 37,
  };

  show(state: MainMenuState) {
    this.render();
    const verticalCenteringCorrection = -1;

    const tankElem = this.overlay.renderElement({
      posX: 14,
      posY: this.mainMenuStateYPos[state] + verticalCenteringCorrection,
      width: 4,
      height: 4,
      color: 'yellow',
      spriteCoordinates: spriteCoordinates.playerOneTank.RIGHT,
    });

    /**Запуск анимации танка-курсора в меню.*/
    tankElem.startAnimation({
      delay: 25,
      spriteCoordinates: spriteCoordinates.playerOneTank.RIGHT,
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

    this.overlay.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.SINGLEPLAYER],
      width: 20,
      height: 2.2,
      color: 'white',
      text: '1 ИГРОК',
    });

    this.overlay.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.MULTIPLAYER],
      width: 20,
      height: 2.2,
      color: 'white',
      text: '2 ИГРОКА',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 50,
      width: view.width,
      height: 1,
      color: 'lightgrey',
      text: 'WASD ИЛИ СТРЕЛКИ ДЛЯ ДВИЖЕНИЯ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 52,
      width: view.width,
      height: 1,
      color: 'lightgrey',
      text: 'ПРОБЕЛ ИЛИ ВВОД ДЛЯ СТРЕЛЬБЫ',
      align: 'center',
    });
  }
}
