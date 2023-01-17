import { playerInitialSettings } from '../data/constants';
import { Tank } from '../entities';
import { Player, ScenarioEvent } from '../typings';
import { Game, Scenario } from './';

describe('game/services/Scenario', () => {
  it('should create tank', () => {
    const game = Game.create();
    game.view.load(document.body);
    const scenario = new Scenario(game);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tank = scenario.state.players[Player.Player1].entity!;

    expect(tank instanceof Tank).toBe(true);
    expect(tank.spawned).toBe(true);
    expect(tank.posX).toBe(playerInitialSettings[Player.Player1].posX);
    expect(tank.posY).toBe(playerInitialSettings[Player.Player1].posY);
    expect(game.loop.loopEntities.has(tank)).toBe(true);
  });

  // TODO: этот тест особо ничего не проверяет, его нужно отрефакторить
  it('should destroy entity', () => {
    const game = Game.create();
    game.view.load(document.body);
    const scenario = new Scenario(game);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tank = scenario.state.players[Player.Player1].entity!;

    game.loop.loopEntities.delete(tank);

    expect(tank.spawned).toBe(false);
    expect(game.loop.loopEntities.has(tank)).toBe(false);
  });

  it('should create projectile and tank explosions', () => {
    const game = Game.create();
    game.view.load(document.body);
    const scenario = new Scenario(game);
    const createExplosionMock = jest.spyOn(scenario, 'createExplosion').mockImplementation();

    scenario.emit(ScenarioEvent.ProjectileHit, {});
    scenario.emit(ScenarioEvent.TankEnemyDestroyed, {});

    expect(createExplosionMock).toHaveBeenCalledTimes(2);
  });
});
