import { playerInitialSettings } from '../data/constants';
import { Tank } from '../entities';
import { Player, ScenarioEvent } from '../typings';
import { Game, Scenario } from './';

describe('game/services/Scenario', () => {
  it('should create tank', () => {
    const game = Game.create();
    game.createView(document.body);
    const scenario = new Scenario(game);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tank = scenario.state.players[Player.PLAYER1].entity!;

    expect(tank instanceof Tank).toBe(true);
    expect(tank.spawned).toBe(true);
    expect(tank.posX).toBe(playerInitialSettings[Player.PLAYER1].posX);
    expect(tank.posY).toBe(playerInitialSettings[Player.PLAYER1].posY);
    expect(game.loopEntities.has(tank)).toBe(true);
  });

  it('should destroy entity', () => {
    const game = Game.create();
    game.createView(document.body);
    const scenario = new Scenario(game);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tank = scenario.state.players[Player.PLAYER1].entity!;

    game.loopEntities.delete(tank);

    expect(tank.spawned).toBe(false);
    expect(game.loopEntities.has(tank)).toBe(false);
  });

  it('should create projectile and tank explosions', () => {
    const game = Game.create();
    game.createView(document.body);
    const scenario = new Scenario(game);
    const createExplosionMock = jest.spyOn(scenario, 'createExplosion').mockImplementation();

    scenario.emit(ScenarioEvent.PROJECTILE_HIT, {});
    scenario.emit(ScenarioEvent.TANK_ENEMY_DESTROYED, {});

    expect(createExplosionMock).toHaveBeenCalledTimes(2);
  });
});
