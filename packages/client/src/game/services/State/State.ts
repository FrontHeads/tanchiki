import { levels } from '../MapManager/levels';
import { type GameMode } from '../Game/typings';
import { ScreenType } from '../../ui/screens/data';
import { MainMenuState } from '../../ui/screens/UIScreens/data';

export class State {
  inited = false;
  paused = false;

  level = 1;
  maxLevels = levels.length;
  mode: GameMode = 'SINGLEPLAYER';

  /** Используется при отправке статистики на сервер и отображается на экране с очками.
   * Пустое значение, если игрок не авторизован.*/
  username = '';

  playerOne = {
    lives: 2,
    upgradeTier: 1,
  };

  playerTwo = {
    lives: 2,
    upgradeTier: 1,
  };

  screen = ScreenType.Loading;
  mainMenuState = MainMenuState.Singleplayer;

  // Настройки игрового экрана. Размеры заданы в игровых клетках.
  width = 62;
  height = 56;
  boundarySize = 2;
  indicatorsSidebarSize = 6;

  loadResourcesTimeout = 60000;
  gameIntroPopupTimeout = 2000;
  missionAccomplishedRedirectTimeout = 1000;
  gameOverPopupTimeout = 3000;
  scoreScreenTimeout = 7000;

  wallsPowerupDuration = 10000;
  shieldPowerupDuration = 10000;
  freezePowerupDuration = 10000;

  singleplayerMaxTotalEnemies = 5;
  singleplayerMaxActiveEnemies = 4;
  singleplayerEnemiesSpawnDelay = 2000;
  multiplayerMaxTotalEnemies = 20;
  multiplayerMaxActiveEnemies = 6;
  multiplayerEnemiesSpawnDelay = 1000;

  tankRespawnRetryInterval = 200;
  /** Четвёртый, одиннадцатый и восемнадцатый танки появляются переливающимися (за их уничтожение дают бонус). */
  flashingEnemyTanksWithPowerups = [4, 11, 18];

  load() {
    this.inited = true;
    this.paused = false;

    this.playerOne = {
      lives: 2,
      upgradeTier: 1,
    };

    this.playerTwo = {
      lives: 2,
      upgradeTier: 1,
    };
  }

  unload() {
    this.inited = false;
    this.paused = false;
  }

  reset() {
    this.paused = false;
  }

  resetSession() {
    this.unload();
    this.load();
  }
}
