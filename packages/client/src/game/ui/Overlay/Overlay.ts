import { type Game, type View } from '../../services';
import { Color } from '../../services/View/data/colors';
import { type ScreenType } from '../../typings';
import { EventEmitter } from '../../utils';
import { UIElement } from '../';
import { type Screen } from '../screens';
import { type UIElementSettings } from '../UIElement/typings';
import { screenClasses } from './typings';

export class Overlay extends EventEmitter {
  currentScreen?: Screen;
  view: View;
  activeAnimations: Set<ReturnType<typeof setTimeout>> = new Set();

  constructor(public game: Game) {
    super();
    this.view = game.view;
  }

  load() {
    this.reset();
  }

  unload() {
    this.reset();
  }

  reset() {
    this.clearAllListeners();
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

  renderSplashScreen(backgroundColor: Color.Black | Color.Grey = Color.Black) {
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
