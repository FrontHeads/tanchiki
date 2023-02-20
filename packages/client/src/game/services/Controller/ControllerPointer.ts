import { ControllerBase } from './ControllerBase';
import { type BindingConfig } from './KeyBindings';
import { type ControlEvent, type ControllerPointerProps } from './typings';

/** Контроллер для управления при помощи тачскрина или мыши. */
export class ControllerPointer extends ControllerBase {
  /** СSS классы зарезервированные для управления игрой через
   * клики мышкой или касания тачскрина по элементам с этими классами. */
  pointerBindings: BindingConfig;
  startEventName: 'touchstart' | 'mousedown';
  stopEventName: 'touchend' | 'mouseup';

  constructor({ pointerBindings, type }: ControllerPointerProps) {
    super();
    this.pointerBindings = pointerBindings;

    if (type === 'touchscreen') {
      this.startEventName = 'touchstart';
      this.stopEventName = 'touchend';
    } else {
      this.startEventName = 'mousedown';
      this.stopEventName = 'mouseup';
    }
  }

  registerEvents() {
    document.addEventListener(this.startEventName, this.startControlByEvent, { passive: false });
    document.addEventListener(this.stopEventName, this.stopControlByEvent, { passive: false });
  }

  disableEvents() {
    document.removeEventListener(this.startEventName, this.startControlByEvent);
    document.removeEventListener(this.stopEventName, this.stopControlByEvent);
  }

  /** Обрабатывает события mouseDown и touchStart */
  startControlByEvent = (event: ControlEvent) => {
    if (!(event instanceof Event) || !event.target) {
      return;
    }

    const pointerBinding = this.getPointerBinding(event.target);

    if (pointerBinding) {
      event.preventDefault();
      this.emitBindingAction(pointerBinding);
    }
  };

  /** Обрабатывает события mouseUp и touchEnd */
  stopControlByEvent = (event: ControlEvent) => {
    if (!(event instanceof Event) || !event.target) {
      return;
    }

    const pointerBinding = this.getPointerBinding(event.target);

    if (pointerBinding) {
      event.preventDefault();
      this.stopBindingAction(pointerBinding);
    }
  };

  /** Удаляет все действия принудительно. */
  stopControlForce = () => {
    this.activeDirection = {};
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
}
