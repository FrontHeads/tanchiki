import { useEffect } from 'react';

import { Tanchiki } from '../../game';

export const Game = () => {
  useEffect(() => {
    const game = new Tanchiki(document.querySelector('#tanchiki-game'));
    game.init();
  }, []);

  return (
    <section style={{ margin: '0 auto' }}>
      <h2>Заглушка для страницы с игрой</h2>
      <div id="tanchiki-game" style={{ border: '10px solid grey' }}></div>
    </section>
  );
};
