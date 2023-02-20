import { type Direction } from '../../entities/Entity/typings';
import { EventEmitter } from '../../utils';
import { ControllerEvent } from './data';
import { type Binding } from './KeyBindings';
import { type ControlEvent, type Controller } from './typings';

export abstract class ControllerBase extends EventEmitter<ControllerEvent> implements Controller {
  activeDirection: Partial<Record<Direction, boolean>> = {};
  shootProcess: ReturnType<typeof setInterval> | null = null;
  shootIntervalMs = 200;

  constructor() {
    super();
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

  abstract registerEvents(): void;

  abstract disableEvents(): void;

  abstract startControlByEvent(event: ControlEvent): void;

  abstract stopControlByEvent(event: ControlEvent): void;

  /** Запускает событие привязанное к кнопке/клику/тапу, например движение вперед или выстрел. */
  emitBindingAction([action, direction]: Binding) {
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
  stopBindingAction([action, direction]: Binding) {
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
