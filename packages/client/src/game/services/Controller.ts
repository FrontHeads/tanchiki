import { EventBus } from '../utils';

export type ControllerTypeT = Array<'wasd' | 'arrows'>;

export class Controller extends EventBus {
  type: ControllerTypeT;
  pressedKeys: Partial<Record<keyof Controller['keyBindings'], boolean>> = {};
  keyBindings = {
    KeyW: 'UP',
    KeyA: 'LEFT',
    KeyS: 'DOWN',
    KeyD: 'RIGHT',
    Space: 'SHOOT',
    ArrowUp: 'UP',
    ArrowLeft: 'LEFT',
    ArrowDown: 'DOWN',
    ArrowRight: 'RIGHT',
    Enter: 'SHOOT',
    KeyP: 'PAUSE',
  };
  constructor(type: ControllerTypeT) {
    super();
    this.type = type;
    if (type.includes('wasd')) {
      this.registerEventsForWasd();
    }
    if (type.includes('arrows')) {
      this.registerEventsForArrows();
    }
  }
  keyPressed(code: keyof Controller['keyBindings']) {
    if (code === 'KeyP') {
      this.emit('pause');
    } else if (code === 'Space' || code === 'Enter') {
      this.emit('shoot');
    } else {
      this.pressedKeys[code] = true;
      this.emit('move', this.keyBindings[code]);
    }
  }
  keyReleased(code: keyof Controller['keyBindings']) {
    if (code !== 'Space' && code !== 'Enter') {
      delete this.pressedKeys[code];
      if (!Object.keys(this.pressedKeys).length) {
        this.emit('stop', 'STOP');
      }
    }
  }
  registerEventsForWasd() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.repeat) {
        return false;
      }
      switch (event.code) {
        case 'KeyW':
        case 'KeyA':
        case 'KeyS':
        case 'KeyD':
        case 'Space':
        case 'KeyP':
          this.keyPressed(event.code);
          event.preventDefault();
          break;
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'KeyA':
        case 'KeyS':
        case 'KeyD':
          this.keyReleased(event.code);
          event.preventDefault();
          break;
      }
    });
  }
  registerEventsForArrows() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.repeat) {
        return false;
      }
      switch (event.code) {
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'Enter':
        case 'KeyP':
          this.keyPressed(event.code);
          event.preventDefault();
          break;
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowDown':
        case 'ArrowRight':
          this.keyReleased(event.code);
          event.preventDefault();
          break;
      }
    });
  }
}
