import './Stick.css';
import '../controller.css';

import { type FC, useContext } from 'react';
import { Joystick } from 'react-joystick-component';

// import { type Game } from '../../../../game/services';
import { Color } from '../../../../game/services/View/colors';
import { GameContext } from '../../Game';
// import { type IJoystickUpdateEvent } from './typings';

// let currentDirection = '';

export const Stick: FC = () => {
  const { game } = useContext(GameContext);

  return (
    <div className="joystick" data-testid="joystick">
      <Joystick
        size={130}
        throttle={30}
        baseColor={Color.Black}
        stickColor={Color.White}
        move={event => handleMove(event, game)}
        stop={event => handleStop(event, game)}
      />
    </div>
  );
};

// const handleMove = (event: IJoystickUpdateEvent, game: Game) => {
//   //TODO значения типа 'BACKWARD' нужно перенести в обьект stickDirection: { 'BACKWARD': Direction.Down }
//   //TODO вместо свитча сделать условия типа:
//   // if (event.direction !== currentDirection) {
//   // game.controllerAll.startSticking(stickDirection[event.direction])
//   // }
// };

// const handleStop = (event: IJoystickUpdateEvent, game: Game) => {
//   // Можно попробовать вызывать:
//   // game.controllerAll.endSticking(stickDirection[currentDirection])
//   // А если это не сработает, тогда:
//   // stickDirection.forEach((value) => {
//   //  game.controllerAll.endSticking(value)
//   // })

//   currentDirection = '';
// };
