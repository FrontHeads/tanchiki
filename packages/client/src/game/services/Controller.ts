import { Direction } from '../typings';
import { EventEmitter, isKeyOfObject } from '../utils';

export type ControllerType = Array<'wasd' | 'arrows'>;

type KeyBinding = ['move' | 'shoot' | 'pause', Direction];

export class Controller extends EventEmitter {
  type: ControllerType;
  enabled = false;
  activeDirection: Partial<Record<Direction, boolean>> = {};
  keyBindingsWasd = {
    KeyW: ['move', Direction.UP],
    KeyA: ['move', Direction.LEFT],
    KeyS: ['move', Direction.DOWN],
    KeyD: ['move', Direction.RIGHT],
    Space: ['shoot'],
  };
  keyBindingsArrows = {
    ArrowUp: ['move', Direction.UP],
    ArrowLeft: ['move', Direction.LEFT],
    ArrowDown: ['move', Direction.DOWN],
    ArrowRight: ['move', Direction.RIGHT],
    Enter: ['shoot'],
  };
  keyBindingsShared = {
    KeyP: ['pause'],
  };

  constructor(type: ControllerType) {
    super();
    this.type = type;
    this.registerEvents();
  }

  registerEvents() {
    this.keydown = this.keydown.bind(this);
    this.keyup = this.keyup.bind(this);
    document.addEventListener('keydown', this.keydown);
    document.addEventListener('keyup', this.keyup);
  }

  disable() {
    document.removeEventListener('keydown', this.keydown);
    document.removeEventListener('keyup', this.keyup);
  }

  getKeyBinding(code: string) {
    if (isKeyOfObject(code, this.keyBindingsShared)) {
      return this.keyBindingsShared[code];
    } else if (this.type.includes('wasd') && isKeyOfObject(code, this.keyBindingsWasd)) {
      return this.keyBindingsWasd[code];
    } else if (this.type.includes('arrows') && isKeyOfObject(code, this.keyBindingsArrows)) {
      return this.keyBindingsArrows[code];
    }
    return null;
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
