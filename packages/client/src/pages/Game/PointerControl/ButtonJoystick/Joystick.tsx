import './Joystick.css';
import '../controller.css';

import { type FC } from 'react';

import { ControllerElemsClassName } from '../../../../game/services/Controller/data';

export const Joystick: FC = () => {
  return (
    <div className="joystick" data-testid="joystick">
      <div className="joystick__up joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerElemsClassName.MoveUpBtn}`}>
          <span className={`${ControllerElemsClassName.MoveUpBtn}_arrow`}>▲</span>
        </button>
      </div>
      <div className="joystick__row">
        <div className="joystick__left joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerElemsClassName.MoveLeftBtn}`}>
            <div className={`${ControllerElemsClassName.MoveLeftBtn}_arrow`}>▲</div>
          </button>
        </div>
        <div className="joystick__center" data-testid="joystick__center"></div>
        <div className="joystick__right joystick__horizontal-buttons">
          <button className={`joystick__button ${ControllerElemsClassName.MoveRightBtn}`}>
            <span className={`${ControllerElemsClassName.MoveRightBtn}_arrow`}>▲</span>
          </button>
        </div>
      </div>
      <div className="joystick__bottom joystick__vertical-buttons">
        <button className={`joystick__button ${ControllerElemsClassName.MoveDownBtn}`}>
          <span className={`${ControllerElemsClassName.MoveDownBtn}_arrow`}>▲</span>
        </button>
      </div>
    </div>
  );
};
