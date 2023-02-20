import { EventEmitter } from '../../utils';
import { type Fn } from '../../utils/EventEmitter/typings';
import { type Game } from '..';
import { ControllerEvent, JoystickType, joystickTypeInLS } from './data';
import { type ControlEvent, type Controller } from './typings';

export class ControllerManager extends EventEmitter<ControllerEvent> implements Controller {
  /** Хранит контроллеры, методы которых вызываются при срабатывании событий. */
  controllersList: Controller[] = [];

  constructor(private game: Game, controllers: Controller[]) {
    super();
    this.controllersList = controllers;
  }

  on(eventName: ControllerEvent, callback: Fn) {
    super.on(eventName, callback);

    this.controllersList.forEach(controller => {
      controller.on(eventName, callback);
    });

    return this;
  }

  emit<K extends unknown[]>(eventName: ControllerEvent, ...args: K): void {
    super.emit(eventName, ...args);

    this.controllersList.forEach(controller => {
      controller.emit(eventName, ...args);
    });
  }

  off(eventName: ControllerEvent, callback: Fn) {
    super.off(eventName, callback);

    this.controllersList.forEach(controller => {
      controller.off(eventName, callback);
    });

    return this;
  }

  offAll(eventName: ControllerEvent) {
    super.offAll(eventName);

    this.controllersList.forEach(controller => {
      controller.offAll(eventName);
    });

    return this;
  }

  clearAllListeners() {
    super.clearAllListeners();

    this.controllersList.forEach(controller => {
      controller.clearAllListeners();
    });
  }

  load() {
    this.controllersList.forEach(controller => controller.load());
  }

  unload() {
    this.controllersList.forEach(controller => controller.unload());
  }

  reset() {
    this.controllersList.forEach(controller => controller.reset());
    return this;
  }

  startControlByEvent(event: ControlEvent) {
    this.controllersList.forEach(controller => controller.startControlByEvent(event));
  }

  stopControlByEvent(event: ControlEvent) {
    this.controllersList.forEach(controller => controller.stopControlByEvent(event));
  }

  /** Останавливает все действия принудительно. */
  stopControlForce() {
    this.controllersList.forEach(controller => {
      if (controller.stopControlForce) {
        controller.stopControlForce();
      }
    });
  }

  changeJoystickType() {
    const state = this.game.state;
    const joystickTypesArr = Object.values(JoystickType);

    const currentJoystickIndex = joystickTypesArr.indexOf(state.joystickType);
    const nextJoystickIndex = currentJoystickIndex === joystickTypesArr.length - 1 ? 0 : currentJoystickIndex + 1;

    state.joystickType = joystickTypesArr[nextJoystickIndex];
    localStorage.setItem(joystickTypeInLS, state.joystickType);
    this.emit(ControllerEvent.ToggleJoystickType);

    // Принудительно убираем все действия с отключенного контроллера.
    this.stopControlForce();
  }
}
