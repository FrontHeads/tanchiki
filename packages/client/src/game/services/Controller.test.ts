import { Controller } from './';

function mockKeyDown(...codes: Array<string>) {
  for (const code of codes) {
    const event = new KeyboardEvent('keydown', { code: code });
    document.dispatchEvent(event);
  }
}

function mockKeyUp(...codes: Array<string>) {
  for (const code of codes) {
    const event = new KeyboardEvent('keyup', { code: code });
    document.dispatchEvent(event);
  }
}

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('game/services/Controller', () => {
  it('should handle WASD + space move & shoot bindings', () => {
    const controller = new Controller(['wasd']);
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.on('move', mockMoveFn);
    controller.on('shoot', mockShootFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle WASD stop binding', () => {
    const controller = new Controller(['wasd']);
    const mockFn = jest.fn();

    controller.on('stop', mockFn);
    mockKeyDown('KeyW', 'KeyD');
    sleep();
    mockKeyUp('KeyW');
    sleep();
    mockKeyUp('KeyD');
    sleep();
    mockKeyDown('KeyA');
    sleep();
    mockKeyUp('KeyD');

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should handle arrows + enter move & shoot bindings', () => {
    const controller = new Controller(['arrows']);
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.on('move', mockMoveFn);
    controller.on('shoot', mockShootFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle arrows stop binding', () => {
    const controller = new Controller(['arrows']);
    const mockFn = jest.fn();

    controller.on('stop', mockFn);
    mockKeyDown('ArrowUp', 'ArrowLeft');
    sleep();
    mockKeyUp('ArrowUp');
    sleep();
    mockKeyUp('ArrowLeft');
    sleep();
    mockKeyDown('ArrowRight');
    sleep();
    mockKeyUp('ArrowLeft');

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should not handle arrow keys clicks if WASD is chosen', () => {
    const controller = new Controller(['wasd']);
    const mockFn = jest.fn();

    controller.on('move', mockFn);
    controller.on('shoot', mockFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not handle WASD keys clicks if arrows are chosen', () => {
    const controller = new Controller(['arrows']);
    const mockFn = jest.fn();

    controller.on('move', mockFn);
    controller.on('shoot', mockFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should handle pause binding', () => {
    const controller = new Controller(['wasd', 'arrows']);
    const mockFn = jest.fn();

    controller.on('pause', mockFn);
    mockKeyDown('KeyP');

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should disable', () => {
    const controller = new Controller(['wasd', 'arrows']);
    const mockFn = jest.fn();

    controller.on('move', mockFn);
    controller.on('shoot', mockFn);
    controller.on('pause', mockFn);
    controller.disable();
    mockKeyDown('KeyP', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockFn).not.toHaveBeenCalled();
  });
});
