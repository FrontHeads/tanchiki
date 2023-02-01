import { Direction } from '../../entities/Entity/typings';
import { ControllerEvent } from './data';

export type KeyBinding =
  | [ControllerEvent.Move, Direction]
  | [ControllerEvent.Shoot]
  | [ControllerEvent.Pause]
  | [ControllerEvent.Mute]
  | [ControllerEvent.Fullscreen]
  | [ControllerEvent.Escape];

export type BindingConfig = Record<string, KeyBinding>;

const KeyBindingsGeneral: BindingConfig = {
  KeyP: [ControllerEvent.Pause],
  KeyM: [ControllerEvent.Mute],
  Minus: [ControllerEvent.Mute],
  KeyK: [ControllerEvent.Fullscreen],
  Equal: [ControllerEvent.Fullscreen],
  Backquote: [ControllerEvent.Fullscreen],
  Escape: [ControllerEvent.Escape],
};

export const KeyBindingsWasd: BindingConfig = {
  KeyW: [ControllerEvent.Move, Direction.Up],
  KeyA: [ControllerEvent.Move, Direction.Left],
  KeyS: [ControllerEvent.Move, Direction.Down],
  KeyD: [ControllerEvent.Move, Direction.Right],
  Space: [ControllerEvent.Shoot],
  ...KeyBindingsGeneral,
};

export const KeyBindingsArrows: BindingConfig = {
  ArrowUp: [ControllerEvent.Move, Direction.Up],
  ArrowLeft: [ControllerEvent.Move, Direction.Left],
  ArrowDown: [ControllerEvent.Move, Direction.Down],
  ArrowRight: [ControllerEvent.Move, Direction.Right],
  Enter: [ControllerEvent.Shoot],
  ...KeyBindingsGeneral,
};
