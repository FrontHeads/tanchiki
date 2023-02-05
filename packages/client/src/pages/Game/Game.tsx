import './Game.css';

import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';
import { GameEvents } from '../../game/services/Game/data';
import { ScreenType } from '../../game/ui/screens/data';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import { authSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';
import { Buttons, Joystick } from './MobileControl';

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
    <>
      {generateMetaTags({ title: 'Игра' })}
      <div ref={gameRoot} className="game__root"></div>
      <div className="desktop-controller">
        <Buttons />
      </div>
      <div className="mobile-controller">
        <Joystick />
        <Buttons />
      </div>
    </>
  );
};
