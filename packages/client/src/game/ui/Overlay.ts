import type { View } from '../services';
import { MainMenuState, UIElementSettings } from '../typings';
import { UIElement } from '../ui';

export class Overlay {
  view!: View;
  mainMenuStateYPos = {
    [MainMenuState.SINGLEPLAYER]: 32,
    [MainMenuState.MULTIPLAYER]: 36,
  };

  constructor(view: View) {
    this.view = view;
  }

  clearScreen() {
    this.view.eraseAllEntitiesOnLayer('overlay');
  }

  renderElement(props: UIElementSettings) {
    const elem = new UIElement(props);
    this.view.add(elem);
    elem.render();
    return elem;
  }

  renderBlackScreen() {
    this.renderElement({
      posX: 0,
      posY: 0,
      width: this.view.width,
      height: this.view.height,
      color: 'black',
    });
  }

  animate(animateFunction: (stage: number) => boolean) {
    let stageCount = 0;
    const animateIntervalMs = 20;
    const animateProcess = setInterval(() => {
      const stageResult = animateFunction(++stageCount);
      if (!stageResult) {
        clearInterval(animateProcess);
      }
    }, animateIntervalMs);
  }

  showLoading() {
    this.renderBlackScreen();
    this.renderElement({
      posX: 0,
      posY: 26,
      width: this.view.width,
      height: 4,
      color: 'white',
      text: 'ЗАГРУЗКА...',
      align: 'center',
    });
  }

  showMainMenu(state: MainMenuState) {
    this.updateMainMenuState(state);
  }

  renderMainMenu() {
    this.renderBlackScreen();

    this.renderElement({
      posX: 0,
      posY: 12,
      width: this.view.width,
      height: 7,
      img: this.view.brickBg,
      text: 'ТАНЧИКИ',
      align: 'center',
    });
    this.renderElement({
      posX: 0,
      posY: 21,
      width: this.view.width,
      height: 7,
      img: this.view.brickBg,
      text: '2023',
      align: 'center',
    });
    this.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.SINGLEPLAYER],
      width: 20,
      height: 2,
      color: 'white',
      text: '1 ИГРОК',
    });
    this.renderElement({
      posX: 20,
      posY: this.mainMenuStateYPos[MainMenuState.MULTIPLAYER],
      width: 20,
      height: 2,
      color: 'white',
      text: '2 ИГРОКА',
    });

    this.renderElement({
      posX: 0,
      posY: 50,
      width: this.view.width,
      height: 1,
      color: 'lightgrey',
      text: 'WASD ИЛИ СТРЕЛКИ ДЛЯ ДВИЖЕНИЯ',
      align: 'center',
    });
    this.renderElement({
      posX: 0,
      posY: 52,
      width: this.view.width,
      height: 1,
      color: 'lightgrey',
      text: 'ПРОБЕЛ ИЛИ ВВОД ДЛЯ СТРЕЛЬБЫ',
      align: 'center',
    });
  }

  updateMainMenuState(state: MainMenuState) {
    this.renderMainMenu();

    this.renderElement({
      posX: 16,
      posY: this.mainMenuStateYPos[state],
      width: 2,
      height: 2,
      color: 'yellow',
    });
  }

  showStartScreen(title: string) {
    const initialDelay = 1000;
    const width = this.view.width;
    const height = Math.round(this.view.height / 2);

    this.renderElement({
      posX: 0,
      posY: 0,
      width,
      height: this.view.height,
      color: 'grey',
    });
    this.renderElement({
      posX: 0,
      posY: height - 2,
      width,
      height: 2,
      color: 'black',
      text: title,
      align: 'center',
    });

    setTimeout(() => {
      this.animate(this.updateStartScreenStage.bind(this));
    }, initialDelay);
  }

  updateStartScreenStage(stage = 0) {
    const width = this.view.width;
    const height = Math.round(this.view.height / 2) - stage;

    if (height < 0) {
      return false;
    }

    this.clearScreen();
    this.renderElement({
      posX: 0,
      posY: 0,
      width,
      height,
      color: 'grey',
    });
    this.renderElement({
      posX: 0,
      posY: height + stage * 2,
      width,
      height,
      color: 'grey',
    });

    return true;
  }

  showGameOver() {
    this.animate(this.updateGameOverStage.bind(this));
  }

  updateGameOverStage(stage = 0) {
    const fontSize = 5;
    const posY = this.view.height - stage;
    const middle = (this.view.height - fontSize) / 2;

    if (posY < middle) {
      return false;
    }

    this.clearScreen();
    this.renderElement({
      posX: 0,
      posY,
      width: this.view.width,
      height: fontSize,
      text: 'ПОТРАЧЕНО',
      color: 'red',
      align: 'center',
    });

    return true;
  }
}
