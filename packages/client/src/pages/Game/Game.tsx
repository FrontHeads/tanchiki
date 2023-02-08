import './Game.css';

import { createContext, useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';
import { GameEvents } from '../../game/services/Game/data';
import { ScreenType } from '../../game/ui/screens/data';
import { isTouchscreen } from '../../game/utils/isTouchscreen';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import { authSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { Buttons, Joystick } from './PointerControl';

export const GameContext = createContext<Tanchiki | null>(null);

export const Game = () => {
  const dispatch = useAppDispatch();

  const gameRoot = useRef(null);
  const isTabActive = usePageVisibility();
  const game = Tanchiki.create();
  game.username = useAppSelector(authSelectors.userProfile)?.login || '';

  useEffect(() => {
    game.init(gameRoot.current);

    game.on(GameEvents.UpdateLeaderboard, data => {
      dispatch(leaderboardThunks.addScore(data));
    });

    document.querySelector('.layout')?.classList.add('layout__game');

    return () => {
      game.unload();
      document.querySelector('.layout')?.classList.remove('layout__game');
    };
  }, []);

  /** Если вкладка становится не активной, то ставим игру на паузу */
  useEffect(() => {
    if (isTabActive === false && !game.paused && game.screen === ScreenType.GameStart) {
      game.togglePause();
    }
  }, [isTabActive]);

  return (
    <GameContext.Provider value={game}>
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
    </GameContext.Provider>
  );
};
