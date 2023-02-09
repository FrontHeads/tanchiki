import { ControllerBase } from './ControllerBase';
import { type BindingConfig } from './KeyBindings';

/** Контроллер для управления с мобильных устройств при помощи тачскрина. */
export class ControllerTouchscreen extends ControllerBase {
  constructor({ keyBindings, pointerBindings }: Record<string, BindingConfig>) {
    super({ keyBindings, pointerBindings });
  }

  registerEvents() {
    document.addEventListener('touchstart', this.startPointing, { passive: false });
    document.addEventListener('touchend', this.endPointing, { passive: false });
  }

  disableEvents() {
    document.removeEventListener('touchstart', this.startPointing);
    document.removeEventListener('touchend', this.endPointing);
  }
}
