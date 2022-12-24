import './Game.css';

import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';
import { ScreenType } from '../../game/typings';
import { usePageVisibility } from '../../hooks/usePageVisibility';

export const Game = () => {
  const gameRoot = useRef(null);
  const isTabActive = usePageVisibility();
  const game = Tanchiki.create();

  useEffect(() => {
    game.init(gameRoot.current);
  }, []);

  /** Если вкладка становится не активной, то ставим игру на паузу */
  useEffect(() => {
    if (isTabActive === false && !game.paused && game.screen === ScreenType.GAME) {
      game.togglePause();
    }
  }, [isTabActive]);

  return <div ref={gameRoot} className="game__root"></div>;
};
