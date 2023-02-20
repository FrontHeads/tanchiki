import { ControllerBase } from './ControllerBase';
import { type BindingConfig, StickBindings } from './KeyBindings';
import { type ControlEvent } from './typings';

/** Контроллер для управления при помощи тачскрина или мыши. */
export class ControllerStick extends ControllerBase {
  /** Направления движени которые может возвращать Stick. */
  stickBindings: BindingConfig;

  constructor(stickBindings: BindingConfig) {
    super();
    this.stickBindings = stickBindings;
  }

  registerEvents() {
    // Отстутствует реализация, т.к. данные о событии передаются прямо в startControlByEvent и stopControlByEvent.
  }

  disableEvents() {
    // Отстутствует реализация, т.к. данные о событии передаются прямо в startControlByEvent и stopControlByEvent.
  }

  /** Обрабатывает события перемещения стика в конкретную зону направления движения. */
  startControlByEvent = (stickDirection: ControlEvent) => {
    if (!stickDirection || stickDirection instanceof Event) {
      return;
    }

    this.emitBindingAction(StickBindings[stickDirection]);
  };

  /** Обрабатывает событие отмены касания стика и соответственно остановки движения  */
  stopControlByEvent = (stickDirection: ControlEvent) => {
    if (!stickDirection || stickDirection instanceof Event) {
      return;
    }

    this.stopBindingAction(StickBindings[stickDirection]);
  };
}
