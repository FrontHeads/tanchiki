import { Direction } from '../typings';

export type KeyBinding = ['move', Direction] | ['shoot'] | ['pause'] | ['mute'] | ['fullscreen'];
export type BindingConfig = Record<string, KeyBinding>;

export const KeyBindingsWasd: BindingConfig = {
  KeyW: ['move', Direction.UP],
  KeyA: ['move', Direction.LEFT],
  KeyS: ['move', Direction.DOWN],
  KeyD: ['move', Direction.RIGHT],
  Space: ['shoot'],
  KeyP: ['pause'],
  KeyM: ['mute'],
  KeyF: ['fullscreen'],
};

export const KeyBindingsArrows: BindingConfig = {
  ArrowUp: ['move', Direction.UP],
  ArrowLeft: ['move', Direction.LEFT],
  ArrowDown: ['move', Direction.DOWN],
  ArrowRight: ['move', Direction.RIGHT],
  Enter: ['shoot'],
  KeyP: ['pause'],
  KeyM: ['mute'],
  KeyF: ['fullscreen'],
};
