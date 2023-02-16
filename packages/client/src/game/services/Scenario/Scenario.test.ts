import { TankPlayer } from '../../entities';
import { sleep } from '../../utils';
import { Game, Scenario } from '../';
import { Player, playerInitialSettings } from './data';
import { ScenarioEvent } from './typings';

let game: Game;

function getPlayerOneTank() {
  return [...(game?.loop?.loopEntities || null)]
    .filter(item => {
      return item instanceof TankPlayer && item.variant === 'PLAYER1';
    })
    .pop() as TankPlayer;
}

describe('game/services/Scenario', () => {
  it('should create tanks', () => {
    game = Game.create();
    game.view.load(document.body);
    game.audioManager.playSound = jest.fn();
    game.state.mode = 'SINGLEPLAYER';

    const scenario = new Scenario(game);

    const tank = getPlayerOneTank();

    expect(scenario).toBeTruthy();
    expect(tank.spawned).toBe(true);
    expect(tank.posX).toBe(playerInitialSettings[Player.Player1].posX);
    expect(tank.posY).toBe(playerInitialSettings[Player.Player1].posY);
  });

  it('should create projectiles', () => {
    game.reset();
    const scenario = new Scenario(game);
    const createProjectileMock = jest.spyOn(scenario, 'createProjectile').mockImplementation();

    const tank = getPlayerOneTank();
    tank.canShoot = true;
    tank.frozen = false;

    tank.shoot();
    tank.update();

    expect(tank.spawned).toBe(true);
    expect(createProjectileMock).toHaveBeenCalledTimes(1);
  });

  it('should create explosions', () => {
    game.reset();
    const scenario = new Scenario(game);
    const createExplosionMock = jest.spyOn(scenario, 'createExplosion').mockImplementation();

    const tank = getPlayerOneTank();

    tank.beDestroyed(tank);

    expect(tank.spawned).toBe(false);
    expect(createExplosionMock).toHaveBeenCalledTimes(1);
  });

  it('should emit game over event', async () => {
    game.reset();
    const scenario = new Scenario(game);
    const gameOverObserver = jest.fn();

    scenario.on(ScenarioEvent.GameOver, gameOverObserver);

    const tank = getPlayerOneTank();

    // У танка три жизни. Первую сняли в предыдущем тесте. Это вторая.
    tank.beDestroyed(tank);

    await sleep(100);

    // Убиваем танк третий раз.
    tank.beDestroyed(tank);

    expect(tank.spawned).toBe(false);
    expect(gameOverObserver).toHaveBeenCalledTimes(1);
  });
});
