import { Game } from './';
import { Entity, Explosion, Projectile, Score, TankEnemy, TankPlayer } from '../entities';
import { EnemyVariant, EntityEvent, PlayerVariant } from '../typings';

type GameMode = 'SINGLEPLAYER' | 'MULTIPLAYER';

export class Statistics {
  game: Game;
  mode: GameMode = 'SINGLEPLAYER';
  /** Очки топ-1 игрока из лидерборда (TODO: реализовать их подгрузку) */
  highestScore = 20000;
  /** Статистика за текущую игровую сессию: [игрок-1, игрок-2] */
  sessionScore = [0, 0];
  sessionMaps = 0;
  sessionTime = 0;
  /** Статистика за конкретную карту: [игрок-1, игрок-2] */
  mapScore = [0, 0];
  mapEnemiesKilled: Record<EnemyVariant, number[]> = { BASIC: [0, 0], FAST: [0, 0], POWER: [0, 0], ARMOR: [0, 0] };
  mapTime = 0;

  constructor(game: Game) {
    this.game = game;
  }

  load() {
    this.sessionScore = [0, 0];
    this.sessionMaps = 0;
    this.sessionTime = 0;
    this.reset();
  }

  unload() {
    this.reset();
    this.updateLeaderboard();
  }

  reset() {
    this.mapScore = [0, 0];
    this.mapEnemiesKilled = { BASIC: [0, 0], FAST: [0, 0], POWER: [0, 0], ARMOR: [0, 0] };
    this.mapTime = 0;
    this.updateLeaderboard();
  }

  updateLeaderboard() {
    //TODO: сделать отправку данных на сервер
  }

  getPlayerIndex(playerVariant: PlayerVariant) {
    return (playerVariant === 'PLAYER1') ? 0 : 1;
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
    let score = 0;

    switch (enemy.variant) {
      case 'ARMOR':
        score = 400;
        break;
      case 'POWER':
        score = 300;
        break;
      case 'FAST':
        score = 200;
        break;
      case 'BASIC':
        score = 100;
        break;
    }

    if (!(enemy.destroyedBy instanceof Projectile && enemy.destroyedBy.parent instanceof TankPlayer)) {
      return 0;
    }

    const playerTank = enemy.destroyedBy.parent;
    const playerIndex = this.getPlayerIndex(playerTank.variant);

    this.sessionScore[playerIndex] += score;
    this.mapScore[playerIndex] += score;
    ++this.mapEnemiesKilled[enemy.variant][playerIndex];

    return score;
  }

  //TODO: после создание класса бонусов нужно будет реализовать здесь соотв.метод
  //countBonus() {}
}
