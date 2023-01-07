import { spriteCoordinates } from '../../data/constants';
import { EnemiesKilledState, GameMode } from '../../typings';
import { Screen } from './Screen';

type StatisticsScreenState = {
  mode: GameMode;
  sessionScore: number[];
  mapEnemiesKilledCount: EnemiesKilledState;
  mapEnemiesKilledScore: EnemiesKilledState;
  level: number;
};

export class StatisticsScreen extends Screen<StatisticsScreenState> {
  state!: StatisticsScreenState;

  show(state: StatisticsScreenState) {
    this.state = state;
    this.overlay.animate(this.update.bind(this));
  }

  update(stage = 0) {
    if (stage > 2) {
      return false;
    }

    this.overlay.clearScreen();
    this.overlay.renderSplashScreen();

    const fullWidth = this.overlay.view.width;
    const halfWidth = Math.round(fullWidth / 2);
    const oneThirdWidth = Math.round(fullWidth / 3);

    /** Название уровня */
    this.overlay.renderElement({
      posX: 0,
      posY: 12,
      width: fullWidth,
      height: 2,
      align: 'center',
      color: 'white',
      text: `УРОВЕНЬ ${this.state.level}`,
    });

    /** Игрок 1: имя */
    this.overlay.renderElement({
      posX: 0,
      posY: 16,
      width: oneThirdWidth,
      height: 2,
      align: 'right',
      color: 'red',
      text: 'ИГРОК 1',
    });

    /** Игрок 1: очки */
    this.overlay.renderElement({
      posX: 0,
      posY: 20,
      width: oneThirdWidth,
      height: 2,
      align: 'right',
      color: 'orange',
      text: `${this.state.sessionScore[0]}`,
    });

    if (this.state.mode === 'MULTIPLAYER') {
      /** Игрок 2: имя */
      this.overlay.renderElement({
        posX: oneThirdWidth * 2,
        posY: 16,
        width: oneThirdWidth,
        height: 2,
        align: 'left',
        color: 'red',
        text: 'ИГРОК 2',
      });

      /** Игрок 2: очки */
      this.overlay.renderElement({
        posX: oneThirdWidth * 2,
        posY: 20,
        width: oneThirdWidth,
        height: 2,
        align: 'left',
        color: 'orange',
        text: `${this.state.sessionScore[1]}`,
      });
    }

    /** Вражеские танки */
    /** Общее количество убитых танков: [игрок-1, игрок-2] */
    const mapEnemiesKilledCountTotal = [0, 0];
    const mapEnemiesKilledScore = Object.values(this.state.mapEnemiesKilledScore);
    const mapEnemiesKilledCount = Object.values(this.state.mapEnemiesKilledCount);
    const mapEnemiesKilledVariants = Object.keys(this.state.mapEnemiesKilledCount);

    let currentPosY = 20;

    for (let i = 0; i < mapEnemiesKilledCount.length; ++i) {
      currentPosY += 5;
      const variant = mapEnemiesKilledVariants[i];
      const score = mapEnemiesKilledScore[i];
      const count = mapEnemiesKilledCount[i];

      mapEnemiesKilledCountTotal[0] += count[0];
      mapEnemiesKilledCountTotal[1] += count[1];

      /** Игрок 1: количество очков за конкретный тип вражеских танков */
      this.overlay.renderElement({
        posX: 0,
        posY: currentPosY,
        width: oneThirdWidth,
        height: 2,
        align: 'right',
        color: 'white',
        text: `${score[0]} ОЧКОВ`,
      });

      /** Игрок 1: количество подбитых вражеских танков конкретного типа */
      this.overlay.renderElement({
        posX: 0,
        posY: currentPosY,
        width: halfWidth - 1.5,
        height: 2,
        align: 'right',
        color: 'white',
        text: `${count[0]}<`,
      });

      /** Картинка вражеского танка */
      this.overlay.renderElement({
        posX: halfWidth - 1.5,
        posY: currentPosY - 0.8,
        width: 3,
        height: 3,
        mainSpriteCoordinates: spriteCoordinates['tank.enemy.default.a'].UP,
      });
  
      if (this.state.mode === 'SINGLEPLAYER') {
        continue;
      }

      /** Игрок 2: количество очков за конкретный тип вражеских танков */
      this.overlay.renderElement({
        posX: oneThirdWidth * 2,
        posY: currentPosY,
        width: oneThirdWidth,
        height: 2,
        align: 'left',
        color: 'white',
        text: `${score[1]} ОЧКОВ`,
      });

      /** Игрок 2: количество подбитых вражеских танков конкретного типа */
      this.overlay.renderElement({
        posX: halfWidth + 1.5,
        posY: currentPosY,
        width: halfWidth - 1.5,
        height: 2,
        align: 'left',
        color: 'white',
        text: `>${count[1]}`,
      });
    }

    //** Горизонтальная линия */
    this.overlay.renderElement({
      posX: oneThirdWidth + 2,
      posY: currentPosY + 3.5,
      width: oneThirdWidth - 4,
      height: 0.5,
      color: 'white',
    });

    //** Игрок 1: надпись "Всего" */
    this.overlay.renderElement({
      posX: 0,
      posY: currentPosY + 5,
      width: oneThirdWidth,
      height: 2,
      align: 'right',
      color: 'white',
      text: `ВСЕГО`,
    });

    //** Игрок 1: танков подбито всего */
    this.overlay.renderElement({
      posX: 0,
      posY: currentPosY + 5,
      width: halfWidth - 1.5,
      height: 2,
      align: 'right',
      color: 'white',
      text: `${mapEnemiesKilledCountTotal[0]} `,
    });

    if (this.state.mode === 'SINGLEPLAYER') {
      return true;
    }

    //** Игрок 2: надпись "Всего" */
    this.overlay.renderElement({
      posX: oneThirdWidth * 2,
      posY: currentPosY + 5,
      width: oneThirdWidth,
      height: 2,
      align: 'left',
      color: 'white',
      text: `ВСЕГО`,
    });

    //** Игрок 2: танков подбито всего */
    this.overlay.renderElement({
      posX: halfWidth + 1.5,
      posY: currentPosY + 5,
      width: halfWidth - 1.5,
      height: 2,
      align: 'left',
      color: 'white',
      text: ` ${mapEnemiesKilledCountTotal[1]}`,
    });

    return true;
  }
}
