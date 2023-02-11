import '../controller.css';
import './Buttons.css';

import cn from 'classnames';
import { type FC, useContext, useEffect, useState } from 'react';

import { ControllerElemsClassName, ServiceButtonsName } from '../../../../game/services/Controller/data';
import { ViewEvents } from '../../../../game/services/View/data';
import { GameContext } from '../../Game';
import { FullscreenSvgImage, MuteSvgImage, PauseSvgImage, ShootSvgImage } from './SVGImages';

export const Buttons: FC = () => {
  const { game, isGameInited } = useContext(GameContext);

  const [showServiceButtons, setShowServiceButtons] = useState<boolean>(false);
  const [isActivePauseBtn, setIsActivePauseButton] = useState<boolean>(false);
  const [isActiveMuteBtn, setIsActiveMuteButton] = useState<boolean>(false);
  const [isActiveFullscreenBtn, setIsActiveFullscreenButton] = useState<boolean>(false);

  useEffect(() => {
    if (!isGameInited) {
      return;
    }

    game.on(ViewEvents.ToggleColorServiceBtn, (buttonName: ServiceButtonsName) => {
      if (buttonName === ServiceButtonsName.Pause) {
        setIsActivePauseButton(prevState => !prevState);
      } else if (buttonName === ServiceButtonsName.Mute) {
        setIsActiveMuteButton(prevState => !prevState);
      } else if (buttonName === ServiceButtonsName.Fullscreen) {
        setIsActiveFullscreenButton(prevState => !prevState);
      }
    });

    game.on(ViewEvents.ToggleVisibilityServiceBtn, () => {
      setShowServiceButtons(prevState => !prevState);
    });
  }, [isGameInited]);

  const pauseButtonClassName = cn(
    `${ControllerElemsClassName.DefaultServiceBtn} ${ControllerElemsClassName.PauseBtn}`,
    {
      [ControllerElemsClassName.ActivatedServiceBtn]: isActivePauseBtn,
    }
  );

  const muteButtonClassName = cn(`${ControllerElemsClassName.DefaultServiceBtn} ${ControllerElemsClassName.MuteBtn}`, {
    [ControllerElemsClassName.ActivatedServiceBtn]: isActiveMuteBtn,
  });

  const fullscreenButtonClassName = cn(
    `${ControllerElemsClassName.DefaultServiceBtn} ${ControllerElemsClassName.FullscreenBtn}`,
    {
      [ControllerElemsClassName.ActivatedServiceBtn]: isActiveFullscreenBtn,
    }
  );

  return (
    <div className="controller">
      <div className="controller__service_wrapper">
        <div className="controller__service" data-testid="controller__service">
          {showServiceButtons ? (
            <>
              <div className={pauseButtonClassName}>
                <PauseSvgImage />
              </div>
              <div className={muteButtonClassName}>
                <MuteSvgImage />
              </div>
            </>
          ) : null}
          {/iPad|iPhone/.test(navigator.userAgent) ? null : (
            <div className={fullscreenButtonClassName}>
              <FullscreenSvgImage />
            </div>
          )}
        </div>
      </div>
      <div className="controller__shoot" data-testid="controller__shoot">
        <button className={ControllerElemsClassName.ShootBtn}>
          <ShootSvgImage />
        </button>
      </div>
      <div className="controller__shoot_centering-balancer"></div>
    </div>
  );
};
