import './Game.css';

import { useEffect, useRef } from 'react';
import { authSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { Tanchiki } from '../../game';
import { GameEvents, ScreenType } from '../../game/typings';
import { usePageVisibility } from '../../hooks/usePageVisibility';

export const Game = () => {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(authSelectors.userProfile);
  const username = userProfile?.login;

  const gameRoot = useRef(null);
  const isTabActive = usePageVisibility();
  const game = Tanchiki.create();

  useEffect(() => {
    game.init(gameRoot.current);

    game.on(GameEvents.UpdateLeaderboard, data => {
      if (!username) {
        return;
      }
      dispatch(leaderboardThunks.addScore({ username, ...data }));
    });

    return () => {
      game.unload();
    };
  }, []);

  /** Если вкладка становится не активной, то ставим игру на паузу */
  useEffect(() => {
    if (isTabActive === false && !game.paused && game.screen === ScreenType.GameStart) {
      game.togglePause();
    }
  }, [isTabActive]);

  return <div ref={gameRoot} className="game__root"></div>;
};
