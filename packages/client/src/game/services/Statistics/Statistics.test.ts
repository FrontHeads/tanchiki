import { Explosion, Projectile, TankEnemy, TankPlayer } from '../../entities';
import { sleep } from '../../utils';
import { Game, GameEvents } from '../';

describe('game/services/Statistics', () => {
  let game: Game;

  /** Jest не умеет обрабатывать alert. Его приходится мокать. */
  global.alert = jest.fn();

  it('should start session', () => {
    game = Game.create();
    game.init(document.body);
    game.state.username = 'TestUser';
    game.audioManager.playSound = jest.fn();
    game.statistics.startSession('SINGLEPLAYER');
    game.statistics.startMap();

    expect(game.statistics).toBeTruthy();
    expect(game.statistics.active).toBe(true);
  });

  it('should count destroyed enemies', async () => {
    const playerTank = new TankPlayer({ variant: 'PLAYER1', posX: 0, posY: 0, width: 2, height: 2 });
    const playerProjectile = new Projectile({ parent: playerTank, posX: 0, posY: 0, width: 2, height: 2 });
    const enemyTank = new TankEnemy({ variant: 'FAST', posX: 2, posY: 2, width: 2, height: 2 });
    enemyTank.spawnTimeout = 1;
    const explosion = new Explosion({ parent: enemyTank });

    game.addEntity(playerTank);
    game.addEntity(playerProjectile);
    game.addEntity(enemyTank);
    game.addEntity(explosion);

    playerTank.spawn();
    playerProjectile.spawn();
    enemyTank.spawn();

    await sleep(50);

    enemyTank.takeDamage(playerProjectile, { posX: 2, posY: 2, width: 2, height: 2 });
    explosion.spawn();

    await sleep(500);

    expect(game.statistics.sessionScore[0]).toBe(200);
    expect(game.statistics.mapScore[0]).toBe(200);
  });

  it('should return current statistics data', () => {
    const data = game.statistics.getCurrentStatistics();

    expect(data.sessionScore[0]).toBe(200);
    expect(data.mapEnemiesKilledTotal[0]).toBe(1);
  });

  it('should emit leaderboard upgrade event', () => {
    const observer = jest.fn();

    game.on(GameEvents.UpdateLeaderboard, observer);
    game.statistics.finishSession();

    expect(observer).toHaveBeenCalled();
    expect(observer.mock.calls[0][0]).toHaveProperty('score', 200);
    expect(observer.mock.calls[0][0]).toHaveProperty('matches', 0);
    expect(observer.mock.calls[0][0]).toHaveProperty('time');
  });

  it('should start and stop timer', async () => {
    game.statistics.startSession('SINGLEPLAYER');
    game.statistics.startMap();
    game.statistics.stopTimer();

    await sleep(100);

    expect(game.statistics.mapElapsedTime < 10).toBe(true);

    game.statistics.startTimer();

    await sleep(500);

    game.statistics.stopTimer();

    expect(game.statistics.mapElapsedTime >= 100).toBe(true);
  });
});
