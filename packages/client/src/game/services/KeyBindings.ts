import { Direction } from '../typings';
import { ControllerEvent } from './../typings/index';

export type KeyBinding =
  | [ControllerEvent.MOVE, Direction]
  | [ControllerEvent.SHOOT]
  | [ControllerEvent.PAUSE]
  | [ControllerEvent.MUTE]
  | [ControllerEvent.FULLSCREEN];

export type BindingConfig = Record<string, KeyBinding>;

export const KeyBindingsWasd: BindingConfig = {
  KeyW: [ControllerEvent.MOVE, Direction.UP],
  KeyA: [ControllerEvent.MOVE, Direction.LEFT],
  KeyS: [ControllerEvent.MOVE, Direction.DOWN],
  KeyD: [ControllerEvent.MOVE, Direction.RIGHT],
  Space: [ControllerEvent.SHOOT],
  KeyP: [ControllerEvent.PAUSE],
  KeyM: [ControllerEvent.MUTE],
  KeyF: [ControllerEvent.FULLSCREEN],
};

export const KeyBindingsArrows: BindingConfig = {
  ArrowUp: [ControllerEvent.MOVE, Direction.UP],
  ArrowLeft: [ControllerEvent.MOVE, Direction.LEFT],
  ArrowDown: [ControllerEvent.MOVE, Direction.DOWN],
  ArrowRight: [ControllerEvent.MOVE, Direction.RIGHT],
  Enter: [ControllerEvent.SHOOT],
  KeyP: [ControllerEvent.PAUSE],
  KeyM: [ControllerEvent.MUTE],
  KeyF: [ControllerEvent.FULLSCREEN],
};
