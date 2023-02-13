import './Game.css';

import { createContext, useEffect, useRef, useState } from 'react';

import { Tanchiki } from '../../game';
import { GameEvents } from '../../game/services/';
import { ControllerElemsClassName } from '../../game/services/Controller/data';
import { ScreenType } from '../../game/ui/screens/data';
import { isTouchscreen } from '../../game/utils/isTouchscreen';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import { authSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { Buttons, Joystick } from './PointerControl';
import { type GameCreateContext } from './typings';

export const GameContext = createContext<GameCreateContext>({} as GameCreateContext);

export const Game = () => {
  const dispatch = useAppDispatch();

  const gameRoot = useRef(null);
  const isTabActive = usePageVisibility();
  const game = Tanchiki.create();
  game.state.username = useAppSelector(authSelectors.userProfile)?.login || '';
  const [isGameInited, setIsGameInited] = useState(game.state.inited);

  useEffect(() => {
    game.init(gameRoot.current);
    setIsGameInited(game.state.inited);

    game.on(GameEvents.UpdateLeaderboard, data => {
      dispatch(leaderboardThunks.addScore(data));
    });

    document.querySelector('.layout')?.classList.add('layout__game');
    setViewportAttributes({ isScalable: false });

    return () => {
      game.unload();
      document.querySelector('.layout')?.classList.remove('layout__game');
      setViewportAttributes({ isScalable: true });
    };
  }, []);

  /** Если вкладка становится неактивной, то ставим игру на паузу */
  useEffect(() => {
    if (isTabActive === false && !game.state.paused && game.state.screen === ScreenType.GameStart) {
      game.togglePause();
    }
  }, [isTabActive]);

  return (
    <GameContext.Provider value={{ game, isGameInited }}>
      <div className={ControllerElemsClassName.FullscreenWrapper}>
        {generateMetaTags({ title: 'Игра Танчики, Battle City 1990 на Dendy' })}
        <div ref={gameRoot} className="game__root"></div>
        {isTouchscreen() ? (
          <div className="pointer-controller">
            <Joystick />
            <Buttons />
          </div>
        ) : (
          <div className="desktop-controller">
            <Buttons />
          </div>
        )}
      </div>
    </GameContext.Provider>
  );
};

function setViewportAttributes({ isScalable }: Record<string, boolean>) {
  const scalableContent = isScalable ? '' : ', maximum-scale=1, user-scalable=no';
  const viewport = document.querySelector('meta[name="viewport"]');

  if (viewport) {
    viewport.setAttribute('content', `width=device-width, initial-scale=1.0${scalableContent}`);
  }
}
