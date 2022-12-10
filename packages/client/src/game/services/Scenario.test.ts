import { Tank } from '../entities';
import { Player } from '../typings';
import { Game, Scenario } from './';
import { PLAYER_INITIAL_PROPS } from './Scenario';

describe('game/services/Scenario', () => {
  it('should create tank', () => {
    const game = Game.create();
    game.createView(document.body);
    const scenario = new Scenario(game);

    const tank = scenario.state[Player.PLAYER1].entity;

    expect(tank instanceof Tank).toBe(true);
    expect(tank.spawned).toBe(true);
    expect(tank.posX).toBe(PLAYER_INITIAL_PROPS[Player.PLAYER1].posX);
    expect(tank.posY).toBe(PLAYER_INITIAL_PROPS[Player.PLAYER1].posY);
    expect(game.loopEntities.has(tank)).toBe(true);
  });

  it('should destroy entity', () => {
    const game = Game.create();
    game.createView(document.body);
    const scenario = new Scenario(game);

    const tank = scenario.state[Player.PLAYER1].entity;

    game.loopEntities.delete(tank);

    expect(tank.spawned).toBe(false);
    expect(game.loopEntities.has(tank)).toBe(false);
  });
});
