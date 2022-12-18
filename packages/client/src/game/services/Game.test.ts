import { Tank } from '../entities';
import { Game } from './';

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mockEntity() {
  const entity = new Tank({ posX: 0, posY: 0 });
  entity.update = jest.fn();
  return entity;
}

describe('game/services/Game', () => {
  it('should be singleton', () => {
    const game1 = Game.create();
    const game2 = Game.create();

    expect(game1).toBe(game2);
  });

  it('should add entities and use loop', async () => {
    const game = Game.create();
    game.loopTimeMs = 100;
    const entity = mockEntity();

    game.addEntity(entity);
    game.startLoop();

    await sleep(200);

    expect(entity.update).toHaveBeenCalled();
  });

  it('should stop loop', () => {
    const game = Game.create();

    game.startLoop();
    game.stopLoop();

    expect(game.loopProcess).toBe(null);
  });

  it('should pause', () => {
    const game = Game.create();
    game.inited = true;

    game.startLoop();
    game.togglePause();

    expect(game.loopProcess).toBe(null);
    expect(game.paused).toBe(true);
  });

  it('should set loop delays', async () => {
    const game = Game.create();
    const entity = mockEntity();
    game.inited = true;
    const delay = 100;
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();

    game.startLoop();
    game.addEntity(entity);
    entity.setLoopDelay(mockFn, delay);
    game.setLoopDelay(mockFn2, delay);

    await sleep(200);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('should clear loop delays', async () => {
    const game = Game.create();
    const entity = mockEntity();
    game.inited = true;
    const delay = 100;
    const mockFn = jest.fn();

    game.startLoop();
    game.addEntity(entity);
    entity.setLoopDelay(mockFn, delay);
    game.clearLoopDelays();

    await sleep(200);

    expect(mockFn).not.toHaveBeenCalled();
  });
});
