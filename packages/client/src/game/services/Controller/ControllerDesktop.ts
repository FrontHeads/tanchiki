import { ControllerBase } from './ControllerBase';
import { type BindingConfig } from './KeyBindings';

/** Контроллер для управления с десктопа. Используется клавиатура и мышь. */
export class ControllerDesktop extends ControllerBase {
  constructor({ keyBindings, pointerBindings }: Record<string, BindingConfig>) {
    super({ keyBindings, pointerBindings });
  }

  registerEvents() {
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);

    if (this.pointerBindings) {
      document.addEventListener('mousedown', this.startPointing);
      document.addEventListener('mouseup', this.endPointing);
    }
  }

  disableEvents() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);

    if (this.pointerBindings) {
      document.removeEventListener('mousedown', this.startPointing);
      document.removeEventListener('mouseup', this.endPointing);
    }
  }
}
