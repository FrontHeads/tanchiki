import { Direction } from '../typings';
import { EventEmitter } from '../utils';
import { BindingConfig, KeyBinding } from './KeyBindings';

export class Controller extends EventEmitter {
  activeDirection: Partial<Record<Direction, boolean>> = {};

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
    this.listeners = {};
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
    if (action === 'move') {
      this.activeDirection[direction] = true;
    }
    this.emit(action, direction);
  }

  keyReleased([action, direction]: KeyBinding) {
    if (action === 'move') {
      delete this.activeDirection[direction];
      const activeDirection = Object.keys(this.activeDirection);
      if (!activeDirection.length) {
        this.emit('stop');
      } else {
        this.emit(action, activeDirection[0]);
      }
    }
  }

  preventDefaultEvent(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
    }
  }
}
