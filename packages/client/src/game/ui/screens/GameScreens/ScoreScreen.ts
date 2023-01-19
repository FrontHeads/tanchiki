import { type GameMode } from '../../../services/Game/typings';
import { type EnemiesKilledState } from '../../../services/Statistics/typings';
import { Color } from '../../../services/View/colors';
import { spriteCoordinates } from '../../../services/View/spriteCoordinates';
import { Screen } from '../Screen';

type ScoreScreenState = {
  mode: GameMode;
  sessionScore: number[];
  mapEnemiesKilledTotal: number[];
  mapEnemiesKilledCount: EnemiesKilledState;
  mapEnemiesKilledScore: EnemiesKilledState;
  level: number;
  username: string;
  skip?: boolean;
};

type CategoryData = {
  score: Array<number | string>;
  count: Array<number | string>;
  enemyTankSprite: number[][];
};

export class ScoreScreen extends Screen<ScoreScreenState> {
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
  playerOneName = 'ИГРОК 1';
  playerTwoName = 'ИГРОК 2';
  sessionScore!: number[];
  mapEnemiesKilledTotal!: number[];
  mapEnemiesKilledCount!: number[][];
  mapEnemiesKilledScore!: number[][];
  categories!: number;
  /** Счётчик от -1 до 20, который нужен для работы анимации,
   * чтобы на каждой её итерации в текущей категории прибавлялось по одному танку для отображения. */
  allowedItemsCounter!: number[];

  show(state: ScoreScreenState) {
    this.sizing = {
      full: this.overlay.view.width,
      half: Math.round(this.overlay.view.width / 2),
      third: Math.round(this.overlay.view.width / 3),
    };

    this.mode = state.mode;
    if (state.username && this.mode === 'SINGLEPLAYER') {
      this.playerOneName = state.username;
    }
    this.level = state.level;
    this.sessionScore = state.sessionScore;
    this.mapEnemiesKilledTotal = state.mapEnemiesKilledTotal;
    this.mapEnemiesKilledCount = Object.values(state.mapEnemiesKilledCount);
    this.mapEnemiesKilledScore = Object.values(state.mapEnemiesKilledScore);
    this.categories = this.mapEnemiesKilledCount.length;
    this.allowedItemsCounter = new Array(this.categories).fill(-1);

    // Чтобы пропустить анимацию с подсчётом
    if (state.skip) {
      this.allowedItemsCounter = new Array(this.categories).fill(20);
      this.update();
    } else {
      this.overlay.animate(this.update.bind(this), this.animationInterval);
    }
  }

  update(stage = 0) {
    // Число 27 выбрано опытным путём, чтобы успели отсчитаться все подбитые танки с учётом анимаций.
    if (stage > 27) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderSplashScreen();

    this.renderHeader();

    this.currentPosY = 20;
    let shouldShowTotalCountFooter = false;

    for (let categoryIndex = 0; categoryIndex < this.categories; ++categoryIndex) {
      const enemyTankSprite = this.enemyTankSprites[categoryIndex];

      const shouldSkipCategory = categoryIndex !== 0 && this.allowedItemsCounter[categoryIndex] === -1;

      if (shouldSkipCategory) {
        this.renderCategory({
          score: [' ', ' '],
          count: [' ', ' '],
          enemyTankSprite,
        });
        continue;
      }

      const playerOneIndex = 0;
      const playerTwoIndex = 1;
      let scoreArray = this.mapEnemiesKilledScore[categoryIndex];
      const countArray = [...this.mapEnemiesKilledCount[categoryIndex]];
      let scoreMultiplier = Math.max(...scoreArray) / Math.max(...countArray);
      if (isNaN(scoreMultiplier) || scoreMultiplier === Infinity) {
        scoreMultiplier = 1;
      }

      const isCurrentCategoryFinished = this.allowedItemsCounter[categoryIndex] > Math.max(...countArray);
      const doesNextCategoryExist = typeof this.allowedItemsCounter[categoryIndex + 1] !== 'undefined';
      const isNextCategoryUncounted = this.allowedItemsCounter[categoryIndex + 1] === -1;

      if (isCurrentCategoryFinished) {
        if (doesNextCategoryExist) {
          if (isNextCategoryUncounted) {
            this.allowedItemsCounter[categoryIndex + 1] = 0;
          }
        } else {
          shouldShowTotalCountFooter = true;
        }
      } else {
        ++this.allowedItemsCounter[categoryIndex];

        const shouldReduceToThreshholdForPlayerOne =
          this.allowedItemsCounter[categoryIndex] < countArray[playerOneIndex];
        const shouldReduceToThreshholdForPlayerTwo =
          this.allowedItemsCounter[categoryIndex] < countArray[playerTwoIndex];

        if (shouldReduceToThreshholdForPlayerOne) {
          countArray[playerOneIndex] = this.allowedItemsCounter[categoryIndex];
        }
        if (shouldReduceToThreshholdForPlayerTwo) {
          countArray[playerTwoIndex] = this.allowedItemsCounter[categoryIndex];
        }

        const shouldPlaySound =
          this.allowedItemsCounter[categoryIndex] > 0 &&
          this.allowedItemsCounter[categoryIndex] <= Math.max(...countArray);

        if (shouldPlaySound) {
          this.overlay.emit('score');
        }
      }

      // Чтобы получить актуальное количество очков, используем количество танков, которое будет отображаться
      scoreArray = [countArray[playerOneIndex] * scoreMultiplier, countArray[playerTwoIndex] * scoreMultiplier];

      this.renderCategory({
        score: scoreArray,
        count: countArray,
        enemyTankSprite,
      });
    }

    this.renderFooter({ count: shouldShowTotalCountFooter ? this.mapEnemiesKilledTotal : [' ', ' '] });

    return true;
  }

  /** Отображает название уровня, игроков, их текущие очки. */
  renderHeader() {
    /** Название уровня */
    this.overlay.renderElement({
      posX: 0,
      posY: 12,
      width: this.sizing.full,
      height: 2,
      align: 'center',
      color: Color.White,
      text: `УРОВЕНЬ ${this.level}`,
    });

    /** Игрок 1: имя */
    this.overlay.renderElement({
      posX: 0,
      posY: 16,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: Color.Red,
      text: this.playerOneName,
    });

    /** Игрок 1: очки */
    this.overlay.renderElement({
      posX: 0,
      posY: 20,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: Color.Orange,
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
      color: Color.Red,
      text: this.playerTwoName,
    });

    /** Игрок 2: очки */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: 20,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: Color.Orange,
      text: `${this.sessionScore[1]}`,
    });
  }

  /** Отображает категорию подбитых вражеских танков с их количеством и очками. */
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
      color: Color.White,
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
      color: Color.White,
      text: `>${count[1]}`,
    });

    /** Игрок 2: количество очков за конкретный тип вражеских танков */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: this.currentPosY,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: Color.White,
      text: `${score[1]} ОЧКОВ`,
    });
  }

  /** Отображает суммарное количество подбитых вражеских танков. */
  renderFooter({ count }: { count: Array<number | string> }) {
    /** Горизонтальная линия */
    this.overlay.renderElement({
      posX: this.sizing.third + 2,
      posY: this.currentPosY + 3.5,
      width: this.sizing.third - 4,
      height: 0.5,
      color: Color.White,
    });

    /** Игрок 1: надпись "Всего" */
    this.overlay.renderElement({
      posX: 0,
      posY: this.currentPosY + 5,
      width: this.sizing.third,
      height: 2,
      align: 'right',
      color: Color.White,
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
      color: Color.White,
      text: ` ${count[1]}`,
    });

    /** Игрок 2: надпись "Всего" */
    this.overlay.renderElement({
      posX: this.sizing.third * 2,
      posY: this.currentPosY + 5,
      width: this.sizing.third,
      height: 2,
      align: 'left',
      color: Color.White,
      text: `ВСЕГО`,
    });
  }
}
