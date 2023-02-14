import { type ControllerPointer } from './ControllerPointer';
import { type BindingConfig } from './KeyBindings';

export type ControllerDesktopProps = {
  keyBindings: BindingConfig;
  controllerMouse?: ControllerPointer;
};

export type ControllerPointerProps = {
  pointerBindings: BindingConfig;
  type: 'touchscreen' | 'mouse';
};
