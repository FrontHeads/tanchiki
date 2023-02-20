import { ControllerBase } from './ControllerBase';
import { type BindingConfig } from './KeyBindings';
import { type ControlEvent } from './typings';

/** Контроллер для управления с десктопа. Используется клавиатура и мышь. */
export class ControllerKeyboard extends ControllerBase {
  /** Кнопки клавиатуры зарезервированные для управления игрой.  */
  keyBindings: BindingConfig;

  constructor(keyBindings: BindingConfig) {
    super();
    this.keyBindings = keyBindings;
  }

  registerEvents() {
    document.addEventListener('keydown', this.startControlByEvent);
    document.addEventListener('keyup', this.stopControlByEvent);
  }

  disableEvents() {
    document.removeEventListener('keydown', this.startControlByEvent);
    document.removeEventListener('keyup', this.stopControlByEvent);
  }

  // Реагирует на keydown событие
  startControlByEvent = (event: ControlEvent) => {
    if (!(event instanceof KeyboardEvent) || event.repeat) {
      return false;
    }
    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.emitBindingAction(keyBinding);
      this.preventDefaultEvent(event);
    }
  };

  // Реагирует на keyup событие
  stopControlByEvent = (event: ControlEvent) => {
    if (!(event instanceof KeyboardEvent)) {
      return false;
    }

    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.stopBindingAction(keyBinding);
      this.preventDefaultEvent(event);
    }
  };

  preventDefaultEvent(event: ControlEvent) {
    if (event instanceof KeyboardEvent && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  }

  getKeyBinding(code: string) {
    return this.keyBindings[code] || null;
  }
}
