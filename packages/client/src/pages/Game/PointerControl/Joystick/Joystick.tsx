import './Joystick.css';
import '../controller.css';

import { type FC } from 'react';

import { ControllerBtnClassName } from '../../../../game/services/Controller/data';

export const Joystick: FC = () => {
  return (
    <div className="joystick" data-testid="joystick">
      <div className="joystick__up joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerBtnClassName.MoveUp}`}>
          <span className={`${ControllerBtnClassName.MoveUp}_arrow`}>▲</span>
        </button>
      </div>
      <div className="joystick__row">
        <div className="joystick__left joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerBtnClassName.MoveLeft}`}>
            <div className={`${ControllerBtnClassName.MoveLeft}_arrow`}>▲</div>
          </button>
        </div>
        <div className="joystick__center" data-testid="joystick__center"></div>
        <div className="joystick__right joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerBtnClassName.MoveRight}`}>
            <span className={`${ControllerBtnClassName.MoveRight}_arrow`}>▲</span>
          </button>
        </div>
      </div>
      <div className="joystick__bottom joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerBtnClassName.MoveDown}`}>
          <span className={`${ControllerBtnClassName.MoveDown}_arrow`}>▲</span>
        </button>
      </div>
    </div>
  );
};
