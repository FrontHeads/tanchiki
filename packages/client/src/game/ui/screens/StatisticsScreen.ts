import { spriteCoordinates } from '../../data/constants';
import { EnemiesKilledState, GameMode } from '../../typings';
import { Screen } from './Screen';

type StatisticsScreenState = {
  mode: GameMode;
  sessionScore: number[];
  mapEnemiesKilledTotal: number[];
  mapEnemiesKilledCount: EnemiesKilledState;
  mapEnemiesKilledScore: EnemiesKilledState;
  level: number;
  skip?: boolean;
};

type CategoryData = {
  score: Array<number | string>;
  count: Array<number | string>;
  enemyTankSprite: number[][];
};

export class StatisticsScreen extends Screen<StatisticsScreenState> {
  animationInterval = 150;
  mode!: GameMode;
  sizing!: { full: number; half: number; third: number };
  currentPosY = 0;
  enemyTankSprites = [
    spriteCoordinates['tank.enemy.default.a'].UP,
    spriteCoordinates['tank.enemy.default.b'].UP,
    spriteCoordinates['tank.enemy.default.c'].UP,
    spriteCoordinates['tank.enemy.default.d'].UP,
  ];
  level!: number;
  sessionScore!: number[];
  mapEnemiesKilledTotal!: number[];
  mapEnemiesKilledCount!: number[][];
  mapEnemiesKilledScore!: number[][];
  categories!: number;
  allowedItemsCounter!: number[];

  show(state: StatisticsScreenState) {
    this.sizing = {
      full: this.overlay.view.width,
      half: Math.round(this.overlay.view.width / 2),
      third: Math.round(this.overlay.view.width / 3),
    };

    this.mode = state.mode;
    this.level = state.level;
    this.sessionScore = state.sessionScore;
    this.mapEnemiesKilledTotal = state.mapEnemiesKilledTotal;
    this.mapEnemiesKilledCount = Object.values(state.mapEnemiesKilledCount);
    this.mapEnemiesKilledScore = Object.values(state.mapEnemiesKilledScore);
    this.categories = this.mapEnemiesKilledCount.length;
    this.allowedItemsCounter = new Array(this.categories).fill(-1);

    if (state.skip) {
      this.allowedItemsCounter = new Array(this.categories).fill(20);
      this.update();
    } else {
      this.overlay.animate(this.update.bind(this), this.animationInterval);
    }
  }

  update(stage = 0) {
    if (stage > 27) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderSplashScreen();

    this.renderHeader();

    this.currentPosY = 20;
    let showFooter = false;

    for (let cat = 0; cat < this.categories; ++cat) {
      const playerOneIndex = 0;
      const playerTwoIndex = 1;
      const enemyTankSprite = this.enemyTankSprites[cat];
      let score = this.mapEnemiesKilledScore[cat];
      const count = [...this.mapEnemiesKilledCount[cat]];
      let scoreMultiplyer = Math.max(...score) / Math.max(...count);
      if (isNaN(scoreMultiplyer) || scoreMultiplyer === Infinity) {
        scoreMultiplyer = 1;
      }
      let emptyCategory = false;

      if (cat !== 0 && this.allowedItemsCounter[cat] === -1) {
        emptyCategory = true;
      } else {
        if (this.allowedItemsCounter[cat] > Math.max(...count)) {
          if (typeof this.allowedItemsCounter[cat + 1] !== 'undefined') {
            if (this.allowedItemsCounter[cat + 1] === -1) {
              this.allowedItemsCounter[cat + 1] = 0;
            }
          } else {
            showFooter = true;
          }
        }

        ++this.allowedItemsCounter[cat];

        if (this.allowedItemsCounter[cat] >= 0) {
          if (this.allowedItemsCounter[cat] < count[playerOneIndex]) {
            count[playerOneIndex] = this.allowedItemsCounter[cat];
          }
          if (this.allowedItemsCounter[cat] < count[playerTwoIndex]) {
            count[playerTwoIndex] = this.allowedItemsCounter[cat];
          }

          const shouldPlaySound =
            this.allowedItemsCounter[cat] > 0 && this.allowedItemsCounter[cat] <= Math.max(...count);

          if (shouldPlaySound) {
            this.overlay.emit('score');
          }
        }

        if (typeof count[playerOneIndex] === 'number' && typeof count[playerTwoIndex] === 'number') {
          score = [count[playerOneIndex] * scoreMultiplyer, count[playerTwoIndex] * scoreMultiplyer];
        }
      }

      this.renderCategory({
        score: emptyCategory ? [' ', ' '] : score,
        count: emptyCategory ? [' ', ' '] : count,
        enemyTankSprite,
      });
    }

    this.renderFooter({ count: showFooter ? this.mapEnemiesKilledTotal : [' ', ' '] });

    return true;
  }

  renderHeader() {
    /** Название уровня */
    this.overlay.renderElement({
      posX: 0,
      posY: 12,
      width: this.sizing.full,
      height: 2,
      align: 'center',
      color: 'white',
      text: `УРОВЕНЬ ${this.level}`,
    });

    /** Игрок 1: имя */
    this.overlay.renderElement({
      posX: 0,
      posY: 16,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: 'red',
      text: 'ИГРОК 1',
    });

    /** Игрок 1: очки */
    this.overlay.renderElement({
      posX: 0,
      posY: 20,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: 'orange',
      text: `${this.sessionScore[0]}`,
    });

    if (this.mode === 'SINGLEPLAYER') {
      return;
    }

    /** Игрок 2: имя */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: 16,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: 'red',
      text: 'ИГРОК 2',
    });

    /** Игрок 2: очки */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: 20,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: 'orange',
      text: `${this.sessionScore[1]}`,
    });
  }

  renderCategory({ score, count, enemyTankSprite }: CategoryData) {
    this.currentPosY += 5;

    /** Игрок 1: количество очков за конкретный тип вражеских танков */
    this.overlay.renderElement({
      posX: 0,
      posY: this.currentPosY,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: 'white',
      text: `${score[0]} ОЧКОВ`,
    });

    /** Игрок 1: количество подбитых вражеских танков конкретного типа */
    this.overlay.renderElement({
      posX: 0,
      posY: this.currentPosY,
      width: this.sizing.half - 1.5,
      height: 2,
      align: 'right',
      color: 'white',
      text: `${count[0]}<`,
    });

    /** Картинка вражеского танка */
    this.overlay.renderElement({
      posX: this.sizing.half - 1,
      posY: this.currentPosY - 0.8,
      width: 3,
      height: 3,
      mainSpriteCoordinates: enemyTankSprite,
    });

    if (this.mode === 'SINGLEPLAYER') {
      return;
    }

    /** Игрок 2: количество подбитых вражеских танков конкретного типа */
    this.overlay.renderElement({
      posX: this.sizing.half + 2.5,
      posY: this.currentPosY,
      width: this.sizing.half - 2.5,
      height: 2,
      align: 'left',
      color: 'white',
      text: `>${count[1]}`,
    });

    /** Игрок 2: количество очков за конкретный тип вражеских танков */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: this.currentPosY,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: 'white',
      text: `${score[1]} ОЧКОВ`,
    });
  }

  renderFooter({ count }: { count: Array<number | string> }) {
    /** Горизонтальная линия */
    this.overlay.renderElement({
      posX: this.sizing.third + 2,
      posY: this.currentPosY + 3.5,
      width: this.sizing.third - 4,
      height: 0.5,
      color: 'white',
    });

    /** Игрок 1: надпись "Всего" */
    this.overlay.renderElement({
      posX: 0,
      posY: this.currentPosY + 5,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: 'white',
      text: `ВСЕГО`,
    });

    /** Игрок 1: танков подбито всего */
    this.overlay.renderElement({
      posX: 0,
      posY: this.currentPosY + 5,
      width: this.sizing.half - 1.5,
      height: 2,
      align: 'right',
      color: 'white',
      text: `${count[0]} `,
    });

    if (this.mode === 'SINGLEPLAYER') {
      return;
    }

    /** Игрок 2: танков подбито всего */
    this.overlay.renderElement({
      posX: this.sizing.half + 2.5,
      posY: this.currentPosY + 5,
      width: this.sizing.half - 2.5,
      height: 2,
      align: 'left',
      color: 'white',
      text: ` ${count[1]}`,
    });

    /** Игрок 2: надпись "Всего" */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: this.currentPosY + 5,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: 'white',
      text: `ВСЕГО`,
    });
  }
}
