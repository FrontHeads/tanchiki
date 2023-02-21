import { type Entity, Explosion, Powerup, Projectile, Score, TankEnemy, TankPlayer } from '../../entities';
import { EntityEvent } from '../../entities/Entity/typings';
import { type EnemyVariant, type PlayerVariant } from '../../entities/Tank/typings';
import { type Game, type GameMode, GameDifficulty } from '../';
import { type EnemiesKilledState } from './typings';

export class Statistics {
  game: Game;
  mode: GameMode = 'SINGLEPLAYER';
  active = false;
  /** Очки топ-1 игрока из лидерборда (TODO: реализовать их подгрузку и отображение) */
  highestScore = 20000;
  /** Статистика за текущую игровую сессию: [игрок-1, игрок-2], общая */
  sessionScore = [0, 0];
  sessionCompletedMaps = 0;
  sessionElapsedTime = 0;
  /** Статистика за конкретный игровой уровень: [игрок-1, игрок-2], общая */
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

  /** Пересчёт очков в зависимости от сложности игры. */
  recountScoreBasedOnDifficulty(score: number) {
    if (this.game.state.difficulty === GameDifficulty.Easy) {
      return score / 2;
    }
    return score;
  }

  /** Отправляет данные для обновления лидерборда. */
  sendRecord() {
    // Если не синглплеер, то лидерборд не обновляем
    if (this.mode !== 'SINGLEPLAYER') {
      return;
    }

    this.game.updateLeaderboard({
      score: this.recountScoreBasedOnDifficulty(this.sessionScore[0]),
      matches: this.sessionCompletedMaps,
      time: this.sessionElapsedTime,
    });
  }

  /** Возвращает данные для показа на соответствующем экране после прохождения карты. */
  getCurrentStatistics() {
    const { mode, sessionScore, mapEnemiesKilledCount } = this;
    const mapEnemiesKilledScore: Partial<EnemiesKilledState> = {};

    const mapEnemiesKilledTotal = [0, 0];

    Object.entries(mapEnemiesKilledCount).forEach(entry => {
      const enemyVariant = entry[0] as EnemyVariant;
      const [enemyCountForPlayerOne, enemyCountForPlayerTwo] = entry[1];
      const scoreMultiplier = this.recountScoreBasedOnDifficulty(this.getScoreByEnemyVariant(enemyVariant));

      mapEnemiesKilledScore[enemyVariant] = [
        enemyCountForPlayerOne * scoreMultiplier,
        enemyCountForPlayerTwo * scoreMultiplier,
      ];

      mapEnemiesKilledTotal[0] += enemyCountForPlayerOne;
      mapEnemiesKilledTotal[1] += enemyCountForPlayerTwo;
    });

    const actualSessionScore = [
      this.recountScoreBasedOnDifficulty(sessionScore[0]),
      this.recountScoreBasedOnDifficulty(sessionScore[1]),
    ];

    return {
      mode,
      sessionScore: actualSessionScore,
      mapEnemiesKilledScore,
      mapEnemiesKilledCount,
      mapEnemiesKilledTotal,
    };
  }

  /** Возвращает множитель с очками за конкретный тип вражеского танка. */
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

  /** Возвращает индекс массива со статданными конкретного пользователя.
   * Большинство данных записывеются в массивы типа [игрок-1, игрок-2].
   */
  getPlayerIndex(playerVariant: PlayerVariant) {
    return playerVariant === 'PLAYER1' ? 0 : 1;
  }

  /** Добавляет сущность в сервис для отслеживания. */
  add(entity: Entity) {
    const isPowerup = entity instanceof Powerup;
    const isEnemyTank = entity instanceof Explosion && entity.parent instanceof TankEnemy;

    if (isPowerup) {
      // После исчезновения бонуса выводим очки
      entity.on(EntityEvent.Destroyed, () => {
        this.createScore(entity);
      });
    }
    // Привязываем подсчёт очков к взрыву вражеских танков
    if (isEnemyTank) {
      // После окончания анимации взрыва выводим очки
      entity.on(EntityEvent.Despawn, () => {
        this.createScore(entity.parent as TankEnemy);
      });
    }
  }

  /** Подсчитываем очки и показываем надпись с их количеством. */
  createScore(parentEntity: TankEnemy | Powerup) {
    const points = this.countPoints(parentEntity);
    const score = new Score({ points, parent: parentEntity });
    this.game.addEntity(score);
    score.spawn();
  }

  /** Определяет, какому игроку записать очки, и обновляет соответствующие показатели. */
  countPoints(entity: TankEnemy | Powerup) {
    const isPowerup = entity instanceof Powerup;
    const isEnemyTank = entity instanceof TankEnemy;
    if (!isPowerup && !isEnemyTank) {
      return 0;
    }

    let playerTank;
    if (entity.destroyedBy instanceof TankPlayer) {
      playerTank = entity.destroyedBy;
    }
    if (entity.destroyedBy instanceof Projectile && entity.destroyedBy.parent instanceof TankPlayer) {
      playerTank = entity.destroyedBy.parent;
    }
    if (!playerTank) {
      return 0;
    }

    let score = 0;
    if (isPowerup) {
      score = 500; // За подбор бонусов даётся 500 очков
    }
    if (isEnemyTank) {
      score = this.getScoreByEnemyVariant(entity.variant);
    }

    const playerIndex = this.getPlayerIndex(playerTank.variant);
    this.sessionScore[playerIndex] += score;
    this.mapScore[playerIndex] += score;

    if (isEnemyTank) {
      ++this.mapEnemiesKilledCount[entity.variant][playerIndex];
    }

    return score;
  }

  /** Запускает игровую сессию, данные которой учитываются в лидерборде. */
  startSession(mode: GameMode) {
    if (this.active) {
      return;
    }
    this.active = true;
    this.mode = mode;
    this.load();
  }

  /** Завершает игровую сессию, данные которой учитываются в лидерборде. */
  finishSession() {
    if (!this.active) {
      return;
    }
    this.finishMap(true);
    this.active = false;
  }

  /** Начинает подсчёт статистики на конкретном игровом уровне. */
  startMap() {
    this.startTimer();
  }

  /** Завершает подсчёт статистики на конкретном игровом уровне. */
  finishMap(gameover = false) {
    this.stopTimer();
    this.sessionElapsedTime += this.mapElapsedTime;
    if (!gameover) {
      ++this.sessionCompletedMaps;
    }
    this.sendRecord();
  }

  /** Запускает отсчёт времени, затрачиваемого на прохождение игрового уровня. */
  startTimer() {
    this.mapStartTime = Date.now();
  }

  /** Останавливает отсчёт времени, затрачиваемого на прохождение игрового уровня. */
  stopTimer() {
    this.mapElapsedTime += Date.now() - this.mapStartTime;
  }
}
