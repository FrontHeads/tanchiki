import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';

export const Game = () => {
  const gameRoot = useRef(null);

  useEffect(() => {
    const game = Tanchiki.create();
    game.init(gameRoot.current);
  }, []);

  return <section ref={gameRoot} style={{ margin: '0 auto' }}></section>;
};
