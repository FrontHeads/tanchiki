import { MainMenuState } from '../../typings';
import { Screen } from '.';

export class MainMenuScreen extends Screen<MainMenuState> {
  mainMenuStateYPos = {
    [MainMenuState.SINGLEPLAYER]: 32,
    [MainMenuState.MULTIPLAYER]: 36,
  };

  show(state: MainMenuState) {
    this.render();

    this.overlay.renderElement({
      posX: 16,
      posY: this.mainMenuStateYPos[state],
      width: 2,
      height: 2,
      color: 'yellow',
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
      img: view.brickBg,
      text: 'ТАНЧИКИ',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 0,
      posY: 21,
      width: view.width,
      height: 7,
      img: view.brickBg,
      text: '2023',
      align: 'center',
    });

    this.overlay.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.SINGLEPLAYER],
      width: 20,
      height: 2,
      color: 'white',
      text: '1 ИГРОК',
    });

    this.overlay.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.MULTIPLAYER],
      width: 20,
      height: 2,
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
