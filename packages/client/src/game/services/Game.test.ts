import { Tank } from '../entities';
import { Game } from './';

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('game/services/Game', () => {
  it('should be singleton', () => {
    const game1 = Game.create({ root: document.body });
    const game2 = Game.create({ root: document.body });

    expect(game1).toBe(game2);
  });

  it('should use loop', () => {
    const game = Game.create({ root: document.body });
    game.loopTimeMs = 100;
    const entity = { step: jest.fn() } as unknown as Tank;
    game.loopEntities.add(entity);

    game.startLoop();

    sleep(100);

    expect(entity.step).toHaveBeenCalled();
  });

  it('should stop loop', () => {
    const game = Game.create({ root: document.body });

    game.startLoop();
    game.stopLoop();

    expect(game.loopProcess).toBe(null);
  });

  it('should pause', () => {
    const game = Game.create({ root: document.body });
    game.inited = true;

    game.startLoop();
    game.togglePause();

    expect(game.loopProcess).toBe(null);
    expect(game.paused).toBe(true);
  });

  it('should create tank', () => {
    const game = Game.create({ root: document.body });

    const tank = game.createTank({ posX: 1, posY: 1 });

    expect(tank instanceof Tank).toBe(true);
    expect(tank.spawned).toBe(true);
    expect(tank.posX).toBe(1);
    expect(tank.posY).toBe(1);
    expect(game.loopEntities.has(tank)).toBe(true);
  });

  it('should destroy entity', () => {
    const game = Game.create({ root: document.body });

    const tank = game.createTank({ posX: 1, posY: 1 });
    game.destroyEntity(tank);

    expect(tank.spawned).toBe(false);
    expect(game.loopEntities.has(tank)).toBe(false);
  });
});
