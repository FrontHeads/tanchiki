import './Stick.css';
import '../controller.css';

import { type FC, useContext } from 'react';
import { Joystick } from 'react-joystick-component';

import { type Game } from '../../../../game/services';
import { StickDirection } from '../../../../game/services/Controller/KeyBindings';
import { Color } from '../../../../game/services/View/colors';
import { GameContext } from '../../Game';
import { type IJoystickUpdateEvent, isStickDirection } from './typings';

export const Stick: FC = () => {
  const { game } = useContext(GameContext);
  let currentDirection: StickDirection | null = null;

  const handleMove = (event: IJoystickUpdateEvent, game: Game) => {
    const isEventDirectionCorrect = event.direction && event.direction !== currentDirection;

    if (!isEventDirectionCorrect) {
      return;
    }

    if (isStickDirection(event.direction)) {
      currentDirection = event.direction;

      game.controllerAll.startControlByEvent(event.direction);
    }
  };

  const handleStop = (game: Game) => {
    if (currentDirection) {
      game.controllerAll.stopControlByEvent(currentDirection);
    }

    if (game.controllerAll.stopControlForce) {
      Object.values(StickDirection).forEach(value => {
        game.controllerAll.stopControlByEvent(value);
      });
    }

    currentDirection = null;
  };

  return (
    <div className="stick" data-testid="stick">
      <Joystick
        size={160}
        baseColor={Color.Black}
        stickColor={Color.White}
        minDistance={45}
        throttle={40}
        move={event => handleMove(event, game)}
        stop={() => handleStop(game)}
      />
    </div>
  );
};
