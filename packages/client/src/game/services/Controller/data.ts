export enum ControllerEvent {
  Stop = 'STOP',
  Move = 'MOVE',
  Shoot = 'SHOOT',
  Pause = 'PAUSE',
  Fullscreen = 'FULLSCREEN',
  Mute = 'MUTE',
  Escape = 'ESCAPE',
}

export enum ServiceButtonsName {
  Pause = 'PAUSE',
  Mute = 'MUTE',
  Fullscreen = 'FULLSCREEN',
}

export enum ControllerBtnClassName {
  Shoot = 'controller__shoot-btn',
  MoveUp = 'joystick__up-button',
  MoveRight = 'joystick__right-button',
  MoveLeft = 'joystick__left-button',
  MoveDown = 'joystick__bottom-button',
  Pause = 'controller__service-btn_pause',
  Mute = 'controller__service-btn_mute',
  Fullscreen = 'controller__service-btn_fullscreen',
  DefaultServiceBtn = 'controller__service-btn',
  ActivatedServiceBtn = 'controller__service-btn_activated',
}
