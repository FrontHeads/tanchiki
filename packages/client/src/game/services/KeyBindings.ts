import { Direction } from '../typings';
import { ControllerEvent } from './../typings/index';

export type KeyBinding =
  | [ControllerEvent.MOVE, Direction]
  | [ControllerEvent.SHOOT]
  | [ControllerEvent.PAUSE]
  | [ControllerEvent.MUTE]
  | [ControllerEvent.FULLSCREEN]
  | [ControllerEvent.ESCAPE];

export type BindingConfig = Record<string, KeyBinding>;

const KeyBindingsGeneral: BindingConfig = {
  KeyP: [ControllerEvent.PAUSE],
  KeyM: [ControllerEvent.MUTE],
  KeyF: [ControllerEvent.FULLSCREEN],
  Escape: [ControllerEvent.ESCAPE],
};

export const KeyBindingsWasd: BindingConfig = {
  KeyW: [ControllerEvent.MOVE, Direction.UP],
  KeyA: [ControllerEvent.MOVE, Direction.LEFT],
  KeyS: [ControllerEvent.MOVE, Direction.DOWN],
  KeyD: [ControllerEvent.MOVE, Direction.RIGHT],
  Space: [ControllerEvent.SHOOT],
  ...KeyBindingsGeneral,
};

export const KeyBindingsArrows: BindingConfig = {
  ArrowUp: [ControllerEvent.MOVE, Direction.UP],
  ArrowLeft: [ControllerEvent.MOVE, Direction.LEFT],
  ArrowDown: [ControllerEvent.MOVE, Direction.DOWN],
  ArrowRight: [ControllerEvent.MOVE, Direction.RIGHT],
  Enter: [ControllerEvent.SHOOT],
  ...KeyBindingsGeneral,
};
