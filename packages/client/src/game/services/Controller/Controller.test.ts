import { sleep } from '../../utils/sleepTimer';
import { ControllerDesktop } from './ControllerDesktop';
import { ControllerPointer } from './ControllerPointer';
import { ControllerElemsClassName, ControllerEvent } from './data';
import { KeyBindingsArrows, KeyBindingsWasd, PointerBindings } from './KeyBindings';

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

function mockPointerStart(className: string, eventName: 'mousedown' | 'touchstart') {
  const button = document.createElement('button');
  button.className = className;
  document.body.appendChild(button);

  const event = new MouseEvent(eventName, {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  button.dispatchEvent(event);
}

describe('game/services/Controller', () => {
  it('should handle WASD + space move & shoot bindings', () => {
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsWasd });
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Move, mockMoveFn);
    controller.on(ControllerEvent.Shoot, mockShootFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle WASD stop binding', async () => {
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsWasd });
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Stop, mockFn);
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
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsArrows });
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Move, mockMoveFn);
    controller.on(ControllerEvent.Shoot, mockShootFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockMoveFn).toBeCalledTimes(4);
    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });

  it('should handle arrows stop binding', async () => {
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsArrows });
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Stop, mockFn);
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
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsWasd });
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Move, mockFn);
    controller.on(ControllerEvent.Shoot, mockFn);
    mockKeyDown('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should not handle WASD keys clicks if arrows are chosen', () => {
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsArrows });
    const mockFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Move, mockFn);
    controller.on(ControllerEvent.Shoot, mockFn);
    mockKeyDown('KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should auto shoot while key is pressed', async () => {
    const controller = new ControllerDesktop({ keyBindings: KeyBindingsWasd });
    controller.shootIntervalMs = 500;
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Shoot, mockShootFn);
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
      const controller = new ControllerDesktop({ keyBindings: bindings });
      const mockFn = jest.fn();

      controller.load();
      controller.on(ControllerEvent.Pause, mockFn);
      mockKeyDown('KeyP');

      expect(mockFn).toBeCalledTimes(1);
    });

    it(`${name}: should disable`, () => {
      const controller = new ControllerDesktop({ keyBindings: bindings });
      const mockFn = jest.fn();

      controller.load();
      controller.on(ControllerEvent.Move, mockFn);
      controller.on(ControllerEvent.Shoot, mockFn);
      controller.on(ControllerEvent.Pause, mockFn);
      controller.unload();
      mockKeyDown('KeyP', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space');

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  it(`it should handle bindings by mousedown`, () => {
    const controller = new ControllerDesktop({
      keyBindings: KeyBindingsWasd,
      controllerMouse: new ControllerPointer({
        pointerBindings: PointerBindings,
        type: 'mouse',
      }),
    });
    const mockPauseFn = jest.fn();
    const mockMuteFn = jest.fn();
    const mockFullscreenFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Pause, mockPauseFn);
    controller.on(ControllerEvent.Mute, mockMuteFn);
    controller.on(ControllerEvent.Fullscreen, mockFullscreenFn);
    mockPointerStart(ControllerElemsClassName.PauseBtn, 'mousedown');
    mockPointerStart(ControllerElemsClassName.MuteBtn, 'mousedown');
    mockPointerStart(ControllerElemsClassName.FullscreenBtn, 'mousedown');

    expect(mockPauseFn).toBeCalledTimes(1);
    expect(mockMuteFn).toBeCalledTimes(1);
    // expect(mockFullscreenFn).toBeCalledTimes(1);
  });

  it(`it should handle shoot binding by touchstart`, () => {
    const controller = new ControllerPointer({ pointerBindings: PointerBindings, type: 'touchscreen' });
    const mockMoveFn = jest.fn();
    const mockShootFn = jest.fn();

    controller.load();
    controller.on(ControllerEvent.Move, mockMoveFn);
    controller.on(ControllerEvent.Shoot, mockShootFn);
    mockPointerStart(ControllerElemsClassName.MoveUpBtn, 'touchstart');
    mockPointerStart(ControllerElemsClassName.MoveDownBtn, 'touchstart');
    mockPointerStart(ControllerElemsClassName.MoveLeftBtn, 'touchstart');
    mockPointerStart(ControllerElemsClassName.MoveRightBtn, 'touchstart');
    mockPointerStart(ControllerElemsClassName.ShootBtn, 'touchstart');

    expect(mockMoveFn).toHaveBeenNthCalledWith(1, 'UP');
    expect(mockMoveFn).toHaveBeenNthCalledWith(2, 'DOWN');
    expect(mockMoveFn).toHaveBeenNthCalledWith(3, 'LEFT');
    expect(mockMoveFn).toHaveBeenNthCalledWith(4, 'RIGHT');
    expect(mockShootFn).toBeCalledTimes(1);
  });
});
