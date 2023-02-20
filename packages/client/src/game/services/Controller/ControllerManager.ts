import { EventEmitter } from '../../utils';
import { type Fn } from '../../utils/EventEmitter/typings';
import { type ControllerEvent } from '..';
import { type ControlEvent, type Controller } from './typings';

export class ControllerManager extends EventEmitter<ControllerEvent> implements Controller {
  /** Хранит контроллеры, методы которых вызываются при срабатывании событий. */
  controllersList: Controller[] = [];

  constructor(controllers: Controller[]) {
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
}
