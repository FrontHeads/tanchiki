import type { View } from '../services';
import type { UIElementSettings } from '../typings';
import { UIElement } from '../ui';

export class Overlay {
  view!: View;

  constructor(view: View) {
    this.view = view;
  }

  clearScreen() {
    this.view.eraseAllEntitiesOnLayer('overlay');
  }

  createElement(props: UIElementSettings) {
    const elem = new UIElement(props);
    this.view.bindEntityToLayer(elem, 'overlay');
    elem.render();
    return elem;
  }

  showMainMenu() {
    this.updateMainMenuState(0);
  }

  renderMainMenu() {
    this.createElement({ posX: 0, posY: 0, width: this.view.width, height: this.view.height, color: 'black' });
    this.createElement({
      posX: 0,
      posY: 12,
      width: this.view.width,
      height: 6,
      color: '#B73239',
      text: 'ТАНЧИКИ',
      align: 'center',
    });
    this.createElement({
      posX: 0,
      posY: 20,
      width: this.view.width,
      height: 6,
      color: '#B73239',
      text: '2023',
      align: 'center',
    });
    this.createElement({ posX: 20, posY: 30, width: 20, height: 2, color: 'white', text: '1 ИГРОК' });
    this.createElement({ posX: 20, posY: 34, width: 20, height: 2, color: 'white', text: '2 ИГРОКА' });

    this.createElement({
      posX: 0,
      posY: 50,
      width: this.view.width,
      height: 1,
      color: 'lightgrey',
      text: 'WASD ИЛИ СТРЕЛКИ ДЛЯ ДВИЖЕНИЯ',
      align: 'center',
    });
    this.createElement({
      posX: 0,
      posY: 52,
      width: this.view.width,
      height: 1,
      color: 'lightgrey',
      text: 'ПРОБЕЛ ИЛИ ВВОД ДЛЯ СТРЕЛЬБЫ',
      align: 'center',
    });
  }

  updateMainMenuState(state = 0) {
    this.renderMainMenu();
    let posY = 0;
    switch (state) {
      case 1:
        posY = 34;
        break;
      default:
        posY = 30;
        break;
    }
    this.createElement({ posX: 16, posY, width: 2, height: 2, color: 'yellow' });
  }

  showStartScreen(title: string) {
    const initialDelay = 1000;
    const width = this.view.width;
    const height = Math.round(this.view.height / 2);

    this.createElement({ posX: 0, posY: 0, width, height: this.view.height, color: 'grey' });
    this.createElement({ posX: 0, posY: height, width, height: 2, color: 'black', text: title, align: 'center' });

    setTimeout(this.animateStartScreen.bind(this), initialDelay);
  }

  animateStartScreen() {
    let stageCount = 0;
    const animateIntervalMs = 20;
    const animateProcess = setInterval(() => {
      const stageResult = this.updateStartScreenStage(++stageCount);
      if (!stageResult) {
        clearInterval(animateProcess);
      }
    }, animateIntervalMs);
  }

  updateStartScreenStage(stage = 0) {
    const width = this.view.width;
    const height = Math.round(this.view.height / 2) - stage;

    if (height < 0) {
      return false;
    }

    this.clearScreen();
    this.createElement({ posX: 0, posY: 0, width, height, color: 'grey' });
    this.createElement({ posX: 0, posY: height + stage * 2, width, height, color: 'grey' });

    return true;
  }
}
