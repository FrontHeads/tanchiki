import { type Direction } from '../../entities/Entity/typings';
import { EventEmitter } from '../../utils';
import { isTouchscreen } from '../../utils/isTouchscreen';
import { ControllerEvent } from './data';
import { type BindingConfig, type KeyBinding } from './KeyBindings';

export class Controller extends EventEmitter<ControllerEvent> {
  activeDirection: Partial<Record<Direction, boolean>> = {};
  shootProcess: ReturnType<typeof setInterval> | null = null;
  shootIntervalMs = 200;
  /** Кнопки зарезервированные для управления игрой.  */
  keyBindings: BindingConfig;
  /** СSS классы зарезервированные для управления игрой через
   * клики мышкой или касания тачскрина по элементам с этими классами. */
  pointerBindings: BindingConfig;

  constructor({ keyBindings, pointerBindings }: Record<string, BindingConfig>) {
    super();
    this.keyBindings = keyBindings;
    this.pointerBindings = pointerBindings;
  }

  load() {
    this.registerEvents();
  }

  unload() {
    this.disableEvents();
  }

  reset() {
    this.clearAllListeners();
    return this;
  }

  registerEvents() {
    if (this.keyBindings) {
      document.addEventListener('keydown', this.keydown);
      document.addEventListener('keyup', this.keyup);
    }

    if (this.pointerBindings) {
      if (isTouchscreen()) {
        document.addEventListener('touchstart', this.startPointing, { passive: false });
        document.addEventListener('touchend', this.endPointing, { passive: false });
      } else {
        document.addEventListener('mousedown', this.startPointing);
        document.addEventListener('mouseup', this.endPointing);
      }
    }
  }

  disableEvents() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);

    if (isTouchscreen()) {
      document.removeEventListener('touchstart', this.startPointing);
      document.removeEventListener('touchend', this.endPointing);
    } else {
      document.removeEventListener('mousedown', this.startPointing);
      document.removeEventListener('mouseup', this.endPointing);
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

  /** Обрабатывает события mouseDown и touchStart */
  startPointing = (event: MouseEvent | TouchEvent) => {
    if (!event.target) {
      return;
    }

    const pointerBinding = this.getPointerBinding(event.target);

    if (pointerBinding) {
      event.preventDefault();
      this.emitBindingAction(pointerBinding);
    }
  };

  /** Обрабатывает события mouseUp и touchEnd */
  endPointing = (event: MouseEvent | TouchEvent) => {
    if (!event.target) {
      return;
    }

    const pointerBinding = this.getPointerBinding(event.target);

    if (pointerBinding) {
      event.preventDefault();
      this.stopBindingAction(pointerBinding);
    }
  };

  /** Проверяет существует ли соответствующее событие для клика/тапа по элементу с определенным CSS-классом. */
  getPointerBinding(target: EventTarget) {
    if (!(target instanceof HTMLElement || target instanceof SVGElement) || !this.pointerBindings) {
      return;
    }

    let result = null;

    for (const [key, value] of Object.entries(this.pointerBindings)) {
      if (target.closest(`.${key}`)) {
        result = value;
        break;
      }
    }

    return result;
  }

  /** Запускает событие привязанное к кнопке/клику/тапу, например движение вперед или выстрел. */
  emitBindingAction([action, direction]: KeyBinding) {
    if (action === ControllerEvent.Move) {
      this.activeDirection[direction] = true;
    }
    this.emit(action, direction);

    if (action === ControllerEvent.Shoot) {
      if (this.shootProcess) {
        clearInterval(this.shootProcess);
        this.shootProcess = null;
      }
      this.shootProcess = setInterval(() => {
        this.emit(action);
      }, this.shootIntervalMs);
    }
  }

  /** Останавливает событие привязанное к кнопке/клику/тапу, например движение вперед или выстрел. */
  stopBindingAction([action, direction]: KeyBinding) {
    if (action === ControllerEvent.Move) {
      delete this.activeDirection[direction];
      const activeDirection = Object.keys(this.activeDirection);
      if (!activeDirection.length) {
        this.emit(ControllerEvent.Stop);
      } else {
        this.emit(action, activeDirection[0]);
      }
    }
    if (action === ControllerEvent.Shoot && this.shootProcess) {
      clearInterval(this.shootProcess);
      this.shootProcess = null;
    }
  }
}
