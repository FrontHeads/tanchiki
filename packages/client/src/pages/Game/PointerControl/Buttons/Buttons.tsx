import '../controller.css';
import './Buttons.css';

import cn from 'classnames';
import { type FC, useContext, useEffect, useState } from 'react';

import { ControllerBtnClassName, ServiceButtonsName } from '../../../../game/services/Controller/data';
import { GameEvents } from '../../../../game/services/Game/data';
import { GameContext } from '../../Game';
import { FullscreenSvgImage, MuteSvgImage, PauseSvgImage, ShootSvgImage } from './SVGImages';

export const Buttons: FC = () => {
  const game = useContext(GameContext);
  const isGameInited = game?.inited;

  const [showMuteAndPauseBtn, setShowMuteAndPauseButton] = useState<boolean>(false);
  const [isActivePauseBtn, setIsActivePauseButton] = useState<boolean>(false);
  const [isActiveMuteBtn, setIsActiveMuteButton] = useState<boolean>(false);

  useEffect(() => {
    if (!isGameInited) {
      return;
    }

    game.on(GameEvents.ToggleColorServiceBtn, (buttonName: ServiceButtonsName) => {
      if (buttonName === ServiceButtonsName.Pause) {
        setIsActivePauseButton(prevState => !prevState);
      } else if (buttonName === ServiceButtonsName.Mute) {
        setIsActiveMuteButton(prevState => !prevState);
      }
    });

    game.on(GameEvents.ToggleVisibilityServiceBtn, () => {
      setShowMuteAndPauseButton(prevState => !prevState);
    });
  }, [isGameInited]);

  const pauseButtonClassName = cn(`${ControllerBtnClassName.DefaultServiceBtn} ${ControllerBtnClassName.Pause}`, {
    [ControllerBtnClassName.ActivatedServiceBtn]: isActivePauseBtn,
  });

  const muteButtonClassName = cn(`${ControllerBtnClassName.DefaultServiceBtn} ${ControllerBtnClassName.Mute}`, {
    [ControllerBtnClassName.ActivatedServiceBtn]: isActiveMuteBtn,
  });

  return (
    <div className="controller">
      <div className="controller__service" data-testid="controller__service">
        {showMuteAndPauseBtn ? (
          <>
            <div className={pauseButtonClassName}>
              <PauseSvgImage />
            </div>
            <div className={muteButtonClassName}>
              <MuteSvgImage />
            </div>
          </>
        ) : null}
        <div className={`${ControllerBtnClassName.DefaultServiceBtn} ${ControllerBtnClassName.Fullscreen}`}>
          <FullscreenSvgImage />
        </div>
      </div>
      <div className="controller__shoot" data-testid="controller__shoot">
        <button className={ControllerBtnClassName.Shoot}>
          <ShootSvgImage />
        </button>
      </div>
    </div>
  );
};
