import { sleep } from '../utils/sleepTimer';
import { ControllerEvent } from './../typings/index';
import { Controller } from './';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';

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

describe('game/services/Controller', () => {
  it('should handle WASD + space move & shoot bindings', () => {
    const controller = new Controller(KeyBindingsWasd);
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.MOVE, mockMoveFn);
    controller.on(ControllerEvent.SHOOT, mockShootFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle WASD stop binding', async () => {
    const controller = new Controller(KeyBindingsWasd);
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.STOP, mockFn);
    mockKeyDown('KeyW', 'KeyD');
    await sleep();
    mockKeyUp('KeyW');
    await sleep();
    mockKeyUp('KeyD');
    await sleep();
    mockKeyDown('KeyA');
    await sleep();
    mockKeyUp('KeyD');

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should handle arrows + enter move & shoot bindings', () => {
    const controller = new Controller(KeyBindingsArrows);
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.MOVE, mockMoveFn);
    controller.on(ControllerEvent.SHOOT, mockShootFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle arrows stop binding', async () => {
    const controller = new Controller(KeyBindingsArrows);
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.STOP, mockFn);
    mockKeyDown('ArrowUp', 'ArrowLeft');
    await sleep();
    mockKeyUp('ArrowUp');
    await sleep();
    mockKeyUp('ArrowLeft');
    await sleep();
    mockKeyDown('ArrowRight');
    await sleep();
    mockKeyUp('ArrowLeft');

    expect(mockFn).toBeCalledTimes(1);
  });

  it('should not handle arrow keys clicks if WASD is chosen', () => {
    const controller = new Controller(KeyBindingsWasd);
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.MOVE, mockFn);
    controller.on(ControllerEvent.SHOOT, mockFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not handle WASD keys clicks if arrows are chosen', () => {
    const controller = new Controller(KeyBindingsArrows);
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.MOVE, mockFn);
    controller.on(ControllerEvent.SHOOT, mockFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should auto shoot while key is pressed', async () => {
    const controller = new Controller(KeyBindingsWasd);
    controller.shootIntervalMs = 500;
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.SHOOT, mockShootFn);
    mockKeyDown('Space');

    await sleep(700);

    expect(mockShootFn).toBeCalledTimes(2);
  });

  const variants = [
    ['arrow', KeyBindingsArrows],
    ['wasd', KeyBindingsWasd],
  ] as const;

  variants.forEach(([name, bindings]) => {
    it(`${name}: should handle pause binding`, () => {
      const controller = new Controller(bindings);
      const mockFn = jest.fn();

      controller.load();
      controller.on(ControllerEvent.PAUSE, mockFn);
      mockKeyDown('KeyP');

      expect(mockFn).toBeCalledTimes(1);
    });

    it(`${name}: should disable`, () => {
      const controller = new Controller(bindings);
      const mockFn = jest.fn();

      controller.load();
      controller.on(ControllerEvent.MOVE, mockFn);
      controller.on(ControllerEvent.SHOOT, mockFn);
      controller.on(ControllerEvent.PAUSE, mockFn);
      controller.unload();
      mockKeyDown('KeyP', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

      expect(mockFn).not.toHaveBeenCalled();
    });
  });
});
