import type { View } from '../services';
import { ScreenType, UIElementSettings } from '../typings';
import { UIElement } from '../ui';
import { Screen, screenClasses } from './screens';

export class Overlay {
  view!: View;
  currentScreen!: Screen;

  constructor(view: View) {
    this.view = view;
  }

  show(screen: ScreenType, state: unknown = null) {
    const ScreenClass = screenClasses[screen];
    if (!(this.currentScreen instanceof ScreenClass)) {
      this.currentScreen = new ScreenClass(this);
    }

    this.currentScreen.show(state);
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

  renderSplashScreen(backgroundColor: 'black' | 'grey' = 'black') {
    this.renderElement({
      posX: 0,
      posY: 0,
      width: this.view.width,
      height: this.view.height,
      color: backgroundColor,
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
    this.renderSplashScreen();
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

  showStartScreen(level: number, startAnimationDelay = 0) {
    this.show(ScreenType.LEVEL_SELECTOR, level);

    setTimeout(() => {
      this.animate(this.updateStartScreenStage.bind(this));
    }, startAnimationDelay);
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

  // showMainMenu(state: MainMenuState) {
  //   this.updateMainMenuState(state);
  // }
}
