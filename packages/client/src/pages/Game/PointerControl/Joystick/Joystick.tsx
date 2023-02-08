import './Joystick.css';
import '../controller.css';

import { type FC } from 'react';

import { ControllerBtnClassName } from '../../../../game/services/Controller/data';

export const Joystick: FC = () => {
  return (
    <div className="joystick" data-testid="joystick">
      <div className="joystick__up joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerBtnClassName.MoveUp}`}>▲</button>
      </div>
      <div className="joystick__row">
        <div className="joystick__left joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerBtnClassName.MoveLeft}`}>◀</button>
        </div>
        <div className="joystick__center" data-testid="joystick__center"></div>
        <div className="joystick__right joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerBtnClassName.MoveRight}`}>▶</button>
        </div>
      </div>
      <div className="joystick__bottom joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerBtnClassName.MoveDown}`}>▼</button>
      </div>
    </div>
  );
};
