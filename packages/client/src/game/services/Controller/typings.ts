import { type Direction } from '../../entities/Entity/typings';
import { type EventEmitter } from '../../utils';
import { type Binding, type BindingConfig, type StickDirection } from './KeyBindings';

export type ControllerPointerProps = {
  pointerBindings: BindingConfig;
  type: 'touchscreen' | 'mouse';
};

export type Controller = EventEmitter & {
  activeDirection?: Partial<Record<Direction, boolean>>;
  shootProcess?: ReturnType<typeof setInterval> | null;
  shootIntervalMs?: number;
  load: () => void;
  unload: () => void;
  reset: () => Controller;
  registerEvents?: () => void;
  disableEvents?: () => void;
  emitBindingAction?: (binding: Binding) => void;
  stopBindingAction?: (binding: Binding) => void;
  startControlByEvent: (event: ControlEvent) => void;
  stopControlByEvent: (event: ControlEvent) => void;
  stopControlForce?: () => void;
  changeJoystickType?: () => void;
};

export type ControlEvent = StickDirection | MouseEvent | TouchEvent | KeyboardEvent;
