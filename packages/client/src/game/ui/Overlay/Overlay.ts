import { Direction } from '../../entities/Entity/typings';
import { type Game, type View } from '../../services';
import { Color } from '../../services/View/colors';
import { EventEmitter } from '../../utils';
import { isTouchscreen } from '../../utils/isTouchscreen';
import { UIElement } from '../';
import { type Screen } from '../screens';
import { type ScreenType } from '../screens/data';
import { MainMenuItem } from '../screens/UIScreens/data';
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

  /** Стирает и заново отрисовывает текстовую сущность на канвасе. Т.е. обновляет вид сущности в игре. */
  refreshTextEntity(entity: UIElement) {
    this.view.eraseFromLayer(entity, 'overlay');
    this.view.drawTextOnLayer(entity, 'overlay');
  }

  changeMainMenuItem(direction: Direction) {
    const state = this.game.state;
    const menuItems = Object.values(MainMenuItem);
    const currentItemIndex = menuItems.indexOf(state.mainMenuItem);
    const menuStepSize = direction === Direction.Up ? -1 : 1;
    let nextItemIndex = currentItemIndex + menuStepSize;

    if (nextItemIndex < 0) {
      nextItemIndex = menuItems.length - 1;
    }

    /** Перепрыгиваем через пункты меню которые не выводятся юзеру при определенных условиях. */
    if (
      (isTouchscreen() && menuItems[nextItemIndex] === MainMenuItem.Multiplayer) ||
      (!isTouchscreen() && menuItems[nextItemIndex] === MainMenuItem.JoystickType)
    ) {
      nextItemIndex += menuStepSize;
    }

    if (nextItemIndex >= menuItems.length) {
      nextItemIndex = 0;
    }

    state.mainMenuItem = menuItems[nextItemIndex];
  }
}
