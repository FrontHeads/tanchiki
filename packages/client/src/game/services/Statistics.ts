import { Game } from './';
import { Entity, Explosion, Projectile, Score, TankEnemy, TankPlayer } from '../entities';
import { EnemiesKilledState, EnemyVariant, EntityEvent, GameEvents, GameMode, PlayerVariant } from '../typings';

export class Statistics {
  game: Game;
  mode: GameMode = 'SINGLEPLAYER';
  active = false;
  /** Очки топ-1 игрока из лидерборда (TODO: реализовать их подгрузку) */
  highestScore = 20000;
  /** Статистика за текущую игровую сессию: [игрок-1, игрок-2] */
  sessionScore = [0, 0];
  sessionCompletedMaps = 0;
  sessionElapsedTime = 0;
  /** Статистика за конкретную карту: [игрок-1, игрок-2] */
  mapScore = [0, 0];
  mapEnemiesKilledCount: EnemiesKilledState = { BASIC: [0, 0], FAST: [0, 0], POWER: [0, 0], ARMOR: [0, 0] };
  mapElapsedTime = 0;
  mapStartTime = 0;

  constructor(game: Game) {
    this.game = game;
  }

  load() {
    this.sessionScore = [0, 0];
    this.sessionCompletedMaps = 0;
    this.sessionElapsedTime = 0;
    this.reset();
  }

  unload() {
    this.finishSession();
    this.reset();
  }

  reset() {
    this.mapScore = [0, 0];
    this.mapEnemiesKilledCount = { BASIC: [0, 0], FAST: [0, 0], POWER: [0, 0], ARMOR: [0, 0] };
    this.mapElapsedTime = 0;
  }

  updateLeaderboard() {
    // Если не синглплеер, то лидерборд не обновляем
    if (this.mode === 'MULTIPLAYER') {
      return;
    }

    this.game.emit(GameEvents.UpdateLeaderboard, {
      score: this.sessionScore[0],
      matches: this.sessionCompletedMaps,
      time: Math.ceil(this.sessionElapsedTime / 1000 / 60), // переводим в минуты
    });
  }

  getCurrentStatistics() {
    const { mode, sessionScore, mapEnemiesKilledCount } = this;
    const mapEnemiesKilledScore: Partial<EnemiesKilledState> = {};

    Object.entries(mapEnemiesKilledCount).forEach(entry => {
      const enemyVariant = entry[0] as EnemyVariant;
      const [enemyCountForPlayerOne, enemyCountForPlayerTwo] = entry[1];
      const scoreMultiplyer = this.getScoreByEnemyVariant(enemyVariant);

      mapEnemiesKilledScore[enemyVariant] = [
        enemyCountForPlayerOne * scoreMultiplyer,
        enemyCountForPlayerTwo * scoreMultiplyer,
      ];
    });

    return { mode, sessionScore, mapEnemiesKilledCount, mapEnemiesKilledScore };
  }

  getScoreByEnemyVariant(enemyVariant: EnemyVariant) {
    switch (enemyVariant) {
      case 'ARMOR':
        return 400;
      case 'POWER':
        return 300;
      case 'FAST':
        return 200;
      case 'BASIC':
        return 100;
    }
  }

  getPlayerIndex(playerVariant: PlayerVariant) {
    return playerVariant === 'PLAYER1' ? 0 : 1;
  }

  add(entity: Entity) {
    if (entity instanceof Explosion && entity.parent instanceof TankEnemy) {
      const enemyTank = entity.parent;
      // После окончания анимации взрыва показываем надпись с очками
      entity.on(EntityEvent.DESPAWN, () => {
        const points = this.countEnemy(enemyTank);
        const score = new Score({ points, parent: enemyTank });
        this.game.addEntity(score);
        score.spawn();
      });
    }
  }

  countEnemy(enemy: TankEnemy) {
    const score = this.getScoreByEnemyVariant(enemy.variant);

    if (!(enemy.destroyedBy instanceof Projectile && enemy.destroyedBy.parent instanceof TankPlayer)) {
      return 0;
    }

    const playerTank = enemy.destroyedBy.parent;
    const playerIndex = this.getPlayerIndex(playerTank.variant);

    this.sessionScore[playerIndex] += score;
    this.mapScore[playerIndex] += score;
    ++this.mapEnemiesKilledCount[enemy.variant][playerIndex];

    return score;
  }

  countBonus() {
    //TODO: после создание класса бонусов нужно будет реализовать здесь соотв.метод
  }

  startSession(mode: GameMode) {
    if (this.active) {
      return;
    }
    this.active = true;
    this.mode = mode;
    this.load();
  }

  finishSession() {
    if (!this.active) {
      return;
    }
    this.finishMap(true);
    this.updateLeaderboard();
    this.active = false;
  }

  startMap() {
    this.mapStartTime = Date.now();
  }

  finishMap(gameover = false) {
    if (!gameover) {
      ++this.sessionCompletedMaps;
    }
    this.mapElapsedTime = Date.now() - this.mapStartTime;
    this.sessionElapsedTime += this.mapElapsedTime;
  }
}
