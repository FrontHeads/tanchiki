import './Joystick.css';
import '../controller.css';

import { type FC } from 'react';

export const Joystick: FC = () => {
  return (
    <div className="joystick">
      <div className="joystick__up joystick__vertical-buttons">
        <button className="joystick__button joystick__up-button">▲</button>
      </div>
      <div className="joystick__row">
        <div className="joystick__left joystick__horizontal-buttons">
          <button className="joystick__button joystick__left-button">◀</button>
        </div>
        <div className="joystick__center"></div>
        <div className="joystick__right joystick__horizontal-buttons">
          <button className="joystick__button joystick__right-button">▶</button>
        </div>
      </div>
      <div className="joystick__bottom joystick__vertical-buttons">
        <button className="joystick__button joystick__bottom-button">▼</button>
      </div>
    </div>
  );
};
