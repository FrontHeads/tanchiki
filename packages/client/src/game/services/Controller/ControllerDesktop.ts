import { type Fn } from '../../utils/EventEmitter/typings';
import { ControllerBase } from './ControllerBase';
import { type ControllerPointer } from './ControllerPointer';
import { type ControllerEvent } from './data';
import { type BindingConfig } from './KeyBindings';
import { type ControllerDesktopProps } from './typings';

/** Контроллер для управления с десктопа. Используется клавиатура и мышь. */
export class ControllerDesktop extends ControllerBase {
  /** Кнопки зарезервированные для управления игрой.  */
  keyBindings: BindingConfig;
  /** Контроллер для управления мышью  */
  controllerMouse?: ControllerPointer;

  constructor({ keyBindings, controllerMouse }: ControllerDesktopProps) {
    super();
    this.keyBindings = keyBindings;
    this.controllerMouse = controllerMouse;
  }

  registerEvents() {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);

    if (this.controllerMouse) {
      this.controllerMouse.load();
    }
  }

  disableEvents() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);

    if (this.controllerMouse) {
      this.controllerMouse.unload();
    }
  }

  keydown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return false;
    }
    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.emitBindingAction(keyBinding);
      this.preventDefaultEvent(event);
    }
  };

  keyup = (event: KeyboardEvent) => {
    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.stopBindingAction(keyBinding);
      this.preventDefaultEvent(event);
    }
  };

  preventDefaultEvent(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  }

  getKeyBinding(code: string) {
    return this.keyBindings[code] || null;
  }

  on(eventName: ControllerEvent, callback: Fn) {
    super.on(eventName, callback);
    this.controllerMouse?.on(eventName, callback);
    return this;
  }

  off(eventName: ControllerEvent, callback: Fn) {
    super.off(eventName, callback);
    this.controllerMouse?.off(eventName, callback);
    return this;
  }

  offAll(eventName: ControllerEvent) {
    super.offAll(eventName);
    this.controllerMouse?.offAll(eventName);
    return this;
  }

  reset() {
    super.reset();
    this.controllerMouse?.reset();
    return this;
  }
}
