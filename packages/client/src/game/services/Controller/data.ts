export enum ControllerEvent {
  Stop = 'STOP',
  Move = 'MOVE',
  Shoot = 'SHOOT',
  Pause = 'PAUSE',
  Fullscreen = 'FULLSCREEN',
  Mute = 'MUTE',
  Escape = 'ESCAPE',
  ToggleJoystickType = 'TOGGLE_JOYSTICK_TYPE',
}

export enum ServiceButtonsName {
  Pause = 'PAUSE',
  Mute = 'MUTE',
  Fullscreen = 'FULLSCREEN',
}

export enum ControllerElemsClassName {
  ShootBtn = 'controller__shoot-btn',
  MoveUpBtn = 'joystick__up-button',
  MoveRightBtn = 'joystick__right-button',
  MoveLeftBtn = 'joystick__left-button',
  MoveDownBtn = 'joystick__bottom-button',
  PauseBtn = 'controller__service-btn_pause',
  MuteBtn = 'controller__service-btn_mute',
  FullscreenBtn = 'controller__service-btn_fullscreen',
  DefaultServiceBtn = 'controller__service-btn',
  ActivatedServiceBtn = 'controller__service-btn_activated',
  FullscreenWrapper = 'game__fullscreen-wrapper',
}

export enum JoystickType {
  Stick = 'СТИК',
  ButtonJoystick = 'КНОПКИ',
}

/** Имя ключа в local storage, где хранится тип выбранного юзером джойстика. */
export const joystickTypeInLS = 'JoystickType';
