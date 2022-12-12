import { screenClasses } from '../data/constants';
import { resources, View } from '../services';
import { ScreenType, UIElementSettings } from '../typings';
import { UIElement } from '../ui';
import { Screen } from './screens';

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
}
