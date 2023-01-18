import { type Direction } from '../../typings';
import { EventEmitter } from '../../utils';
import { ControllerEvent } from './data';
import { type BindingConfig, type KeyBinding } from './KeyBindings';

export class Controller extends EventEmitter<ControllerEvent> {
  activeDirection: Partial<Record<Direction, boolean>> = {};
  shootProcess: ReturnType<typeof setInterval> | null = null;
  shootIntervalMs = 200;

  constructor(private keyBindings: BindingConfig) {
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

  registerEvents() {
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  }

  disableEvents() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  }

  getKeyBinding(code: string) {
    return this.keyBindings[code] || null;
  }

  keydown(event: KeyboardEvent) {
    if (event.repeat) {
      return false;
    }
    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.keyPressed(keyBinding);
      this.preventDefaultEvent(event);
    }
  }

  keyup(event: KeyboardEvent) {
    const keyBinding = this.getKeyBinding(event.code);
    if (keyBinding) {
      this.keyReleased(keyBinding);
      this.preventDefaultEvent(event);
    }
  }

  keyPressed([action, direction]: KeyBinding) {
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

  keyReleased([action, direction]: KeyBinding) {
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

  preventDefaultEvent(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  }
}
