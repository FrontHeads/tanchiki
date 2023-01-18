import { Game } from '..';

describe('game/services/Game', () => {
  it('should be singleton', () => {
    const game1 = Game.create();
    const game2 = Game.create();

    expect(game1).toBe(game2);
  });
});
