import { Tank } from '../entities';
import { Game } from './';

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('game/services/Game', () => {
  it('should be singleton', () => {
    const game1 = Game.getInstance();
    const game2 = Game.getInstance();

    expect(game1).toBe(game2);
  });

  it('should use loop', () => {
    const game = Game.getInstance();
    game.loopTimeMs = 100;
    const entity = { update: jest.fn() } as unknown as Tank;
    game.loopEntities.add(entity);

    game.startLoop();

    sleep(100);

    expect(entity.update).toHaveBeenCalled();
  });

  it('should stop loop', () => {
    const game = Game.getInstance();

    game.startLoop();
    game.stopLoop();

    expect(game.loopProcess).toBe(null);
  });

  it('should pause', () => {
    const game = Game.getInstance();
    game.inited = true;

    game.startLoop();
    game.togglePause();

    expect(game.loopProcess).toBe(null);
    expect(game.paused).toBe(true);
  });
});
