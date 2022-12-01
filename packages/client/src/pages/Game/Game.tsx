import { useEffect, useRef } from 'react';

import { Tanchiki } from '../../game';

export const Game = () => {
  const gameRoot = useRef(null);

  useEffect(() => {
    const game = Tanchiki.create({ root: gameRoot.current });
    game.init();
  }, []);

  return (
    <section style={{ margin: '0 auto' }}>
      <h2>Заглушка для страницы с игрой</h2>
      <div ref={gameRoot} style={{ border: '10px solid grey' }}></div>
    </section>
  );
};
