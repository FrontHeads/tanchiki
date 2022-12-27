import { screenClasses } from '../data/constants';
import { Game, View } from '../services';
import { ScreenType, UIElementSettings } from '../typings';
import { UIElement } from '../ui';
import { Screen } from './screens';

export class Overlay {
  currentScreen?: Screen;
  view: View;
  activeAnimations: Set<ReturnType<typeof setTimeout>> = new Set();

  constructor(public game: Game) {
    this.view = game.view;
  }

  load() {
    this.reset();
  }

  unload() {
    this.reset();
  }

  reset() {
    for (const animateProcess of this.activeAnimations) {
      clearInterval(animateProcess);
    }
    this.activeAnimations = new Set();
    this.clearScreen();
    delete this.currentScreen;
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
    // TODO: нужно подумать над тем, чтобы использовать для анимаций в меню обычные интервалы вне игрового цикла
    this.game.loop.registerTimerHandlers(elem);
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

  animate(animateFunction: (counter: number) => boolean, animateIntervalMs = 25) {
    let stageCount = 0;

    const animateProcess = setInterval(() => {
      const stageResult = animateFunction(++stageCount);

      //**Удаляет интервал (останавливает анимацию) */
      if (!stageResult) {
        this.activeAnimations.delete(animateProcess);
        clearInterval(animateProcess);
      }
    }, animateIntervalMs);
    this.activeAnimations.add(animateProcess);
  }
}
