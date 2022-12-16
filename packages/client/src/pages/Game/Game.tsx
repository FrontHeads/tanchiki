import './Game.css';

import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';

export const Game = () => {
  const gameRoot = useRef(null);

  useEffect(() => {
    const game = Tanchiki.getInstance();
    game.init(gameRoot.current);
  }, []);

  return <div ref={gameRoot} className="game__root"></div>;
};
