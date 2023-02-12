import { Game, Scenario } from '../../services';
import { sleep } from '../../utils';
import { type Powerup, TankPlayer } from '../';
import { Direction } from '../Entity/typings';

let game: Game;
let scenario: Scenario;

describe('game/entities/Powerup', () => {
  it('should appear on map', () => {
    game = Game.create();
    game.view.load(document.body);
    game.audioManager.playSound = jest.fn();
    scenario = new Scenario(game);

    scenario.createPowerup();
    const powerup = scenario.activePowerup;

    expect(powerup).not.toBe(null);
    expect(powerup).toHaveProperty('spawned', true);
  });

  it('should be taken by player', async () => {
    const powerup = scenario.activePowerup as Powerup;
    const playerTank = new TankPlayer({ posX: powerup.posX, posY: powerup.posY });
    game.addEntity(playerTank);
    playerTank.spawnTimeout = 1;
    playerTank.spawn();

    await sleep(100);

    playerTank.move(Direction.Down);

    await sleep(100);

    expect(powerup).toHaveProperty('spawned', false);
    expect(powerup).toHaveProperty('destroyedBy', playerTank);
  });
});
