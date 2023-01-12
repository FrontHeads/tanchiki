import { type Entity, Explosion, Projectile, Score, TankEnemy, TankPlayer } from '../entities';
import {
  type EnemiesKilledState,
  type EnemyVariant,
  type GameMode,
  type PlayerVariant,
  EntityEvent,
  GameEvents,
} from '../typings';
import { type Game } from './';

export class Statistics {
  game: Game;
  mode: GameMode = 'Singleplayer';
  active = false;
  /** Очки топ-1 игрока из лидерборда (TODO: реализовать их подгрузку и отображение) */
  highestScore = 20000;
  /** Статистика за текущую игровую сессию: [игрок-1, игрок-2], общая */
  sessionScore = [0, 0];
  sessionCompletedMaps = 0;
  sessionElapsedTime = 0;
  /** Статистика за конкретный игровой уровень: [игрок-1, игрок-2], общая */
  mapScore = [0, 0];
  mapEnemiesKilledCount: EnemiesKilledState = { Basic: [0, 0], Fast: [0, 0], Power: [0, 0], Armor: [0, 0] };
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
    this.mapEnemiesKilledCount = { Basic: [0, 0], Fast: [0, 0], Power: [0, 0], Armor: [0, 0] };
    this.mapElapsedTime = 0;
  }

  /** Эмитит событие с данными, которое отлавливается на странице с игрой для обновления лидерборда. */
  updateLeaderboard() {
    // Если не синглплеер, то лидерборд не обновляем
    if (this.mode !== 'Singleplayer') {
      return;
    }

    // TODO: нужно переделать, т.к. странно, что кто-то снаружи может заставить другой объект сгенерировать событие
    this.game.emit(GameEvents.UpdateLeaderboard, {
      score: this.sessionScore[0],
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
      const scoreMultiplier = this.getScoreByEnemyVariant(enemyVariant);

      mapEnemiesKilledScore[enemyVariant] = [
        enemyCountForPlayerOne * scoreMultiplier,
        enemyCountForPlayerTwo * scoreMultiplier,
      ];

      mapEnemiesKilledTotal[0] += enemyCountForPlayerOne;
      mapEnemiesKilledTotal[1] += enemyCountForPlayerTwo;
    });

    return { mode, sessionScore, mapEnemiesKilledScore, mapEnemiesKilledCount, mapEnemiesKilledTotal };
  }

  /** Возвращает множитель с очками за конкретный тип вражеского танка. */
  getScoreByEnemyVariant(enemyVariant: EnemyVariant) {
    switch (enemyVariant) {
      case 'Armor':
        return 400;
      case 'Power':
        return 300;
      case 'Fast':
        return 200;
      case 'Basic':
        return 100;
    }
  }

  /** Возвращает индекс массива со статданными конкретного пользователя.
   * Большинство данных записывеются в массивы типа [игрок-1, игрок-2].
   */
  getPlayerIndex(playerVariant: PlayerVariant) {
    return playerVariant === 'Player1' ? 0 : 1;
  }

  /** Добавляет сущность в сервис для отслеживания. */
  add(entity: Entity) {
    // Привязываем подсчёт очков к взрыву вражеских танков
    if (entity instanceof Explosion && entity.parent instanceof TankEnemy) {
      const enemyTank = entity.parent;
      // После окончания анимации взрыва подсчитываем очки и показываем надпись с их количеством
      entity.on(EntityEvent.Despawn, () => {
        const points = this.countEnemy(enemyTank);
        const score = new Score({ points, parent: enemyTank });
        this.game.addEntity(score);
        score.spawn();
      });
    }
  }

  /** Определяет, какому игроку записать очки, и обновляет соответствующие показатели. */
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
    this.mapStartTime = Date.now();
  }

  /** Завершает подсчёт статистики на конкретном игровом уровне. */
  finishMap(gameover = false) {
    this.mapElapsedTime = Date.now() - this.mapStartTime;
    this.sessionElapsedTime += this.mapElapsedTime;
    if (!gameover) {
      ++this.sessionCompletedMaps;
    }
    this.updateLeaderboard();
  }
}
