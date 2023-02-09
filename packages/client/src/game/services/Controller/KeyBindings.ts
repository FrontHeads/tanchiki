import { Direction } from '../../entities/Entity/typings';
import { ControllerBtnClassName, ControllerEvent } from './data';

export type Binding =
  | [ControllerEvent.Move, Direction]
  | [ControllerEvent.Shoot]
  | [ControllerEvent.Pause]
  | [ControllerEvent.Mute]
  | [ControllerEvent.Fullscreen]
  | [ControllerEvent.Escape];

export type BindingConfig = Record<string, Binding>;

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

export const PointerBindings: BindingConfig = {
  [ControllerBtnClassName.Shoot]: [ControllerEvent.Shoot],
  [ControllerBtnClassName.MoveUp]: [ControllerEvent.Move, Direction.Up],
  [ControllerBtnClassName.MoveRight]: [ControllerEvent.Move, Direction.Right],
  [ControllerBtnClassName.MoveLeft]: [ControllerEvent.Move, Direction.Left],
  [ControllerBtnClassName.MoveDown]: [ControllerEvent.Move, Direction.Down],
  [ControllerBtnClassName.Pause]: [ControllerEvent.Pause],
  [ControllerBtnClassName.Mute]: [ControllerEvent.Mute],
  [ControllerBtnClassName.Fullscreen]: [ControllerEvent.Fullscreen],
};
