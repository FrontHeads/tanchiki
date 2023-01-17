import './Game.css';

import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';
import { GameEvents, ScreenType } from '../../game/typings';
import { usePageVisibility } from '../../hooks/usePageVisibility';
import { authSelectors, leaderboardThunks, useAppDispatch, useAppSelector } from '../../store';
import { generateMetaTags } from '../../utils/seoUtils';

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

  return (
    <>
      {generateMetaTags({ title: 'Игра' })}
      <div ref={gameRoot} className="game__root"></div>
    </>
  );
};
