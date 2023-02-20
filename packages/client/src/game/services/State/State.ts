import { ScreenType } from '../../ui/screens/data';
import { MainMenuItem } from '../../ui/screens/UIScreens/data';
import { JoystickType, joystickTypeInLS } from '../Controller/data';
import { type GameMode } from '../Game/typings';
import { levels } from '../MapManager/levels';
import { gameThemeInLS, GameThemeName } from '../View/data';

export class State {
  /** Запущена ли игра. */
  inited = false;
  /** Стоит ли игра на паузе. */
  paused = false;
  /** Режим отладки. */
  debugging = false;

  /** Текущий игровой уровень. */
  level = 1;
  /** Игровых уровней всего (35). */
  maxLevels = levels.length;
  /** Режим игры. */
  mode: GameMode = MainMenuItem.Singleplayer;

  /** Имя темы оформления игры. */
  themeName = (localStorage.getItem(gameThemeInLS) || GameThemeName.Classic) as GameThemeName;
  /** Игрок может выбрать тип джойстика в мобильной версии. */
  joystickType: JoystickType = (localStorage.getItem(joystickTypeInLS) || JoystickType.ButtonJoystick) as JoystickType;

  /** Используется при отправке статистики на сервер и отображается на экране с очками.
   * Пустое значение, если игрок не авторизован.*/
  username = '';

  /** Стартовое количество жизней у игроков. */
  defaultPlayerLives = 2;
  /** Стартовые апгрейды танков игроков. */
  defaultPlayerUpgradeTier = 1;

  /** Состояние первого игрока (жизни, апгрейды танка). */
  playerOne = {
    lives: this.defaultPlayerLives,
    upgradeTier: this.defaultPlayerUpgradeTier,
  };
  /** Состояние второго игрока (жизни, апгрейды танка). */
  playerTwo = {
    lives: this.defaultPlayerLives,
    upgradeTier: this.defaultPlayerUpgradeTier,
  };

  /** Максимальное количество врагов, которые должны появиться на карте (для одиночного режима). */
  singleplayerMaxTotalEnemies = 20;
  /** Максимальное количество врагов, которые могут быть одновременно на карте (для одиночного режима). */
  singleplayerMaxActiveEnemies = 4;
  /** Задержка между спауном вражеских танков (для одиночного режима). */
  singleplayerEnemiesSpawnDelay = 2000;
  /** Максимальное количество врагов, которые должны появиться на карте (для мультиплеера). */
  multiplayerMaxTotalEnemies = 20;
  /** Максимальное количество врагов, которые могут быть одновременно на карте (для мультиплеера). */
  multiplayerMaxActiveEnemies = 6;
  /** Задержка между спауном вражеских танков (для мультиплеера). */
  multiplayerEnemiesSpawnDelay = 1000;
  /** Через сколько осуществляется попытка отспаунить танк, если соответствующее место занято. */
  tankRespawnRetryInterval = 200;
  /** Четвёртый, одиннадцатый и восемнадцатый танки появляются переливающимися (за их уничтожение дают бонус). */
  flashingEnemyTanksWithPowerups = [4, 11, 18];

  /** Текущий игровой экран. */
  screen = ScreenType.Loading;
  /** Выбранный пункт основного меню. */
  mainMenuItem: MainMenuItem = MainMenuItem.Singleplayer;

  // Настройки игрового экрана.
  /** Ширина игрового поля в игровых клетках. */
  width = 62;
  /** Высота игрового поля в игровых клетках. */
  height = 56;
  /** Толщина бортов вокруг поля в игровых клетках. */
  boundarySize = 2;
  /** Толщина индикаторной панели в игровых клетках. */
  indicatorsSidebarSize = 6;

  // Таймауты
  /** Через сколько выдаст ошибку, если игровые ресурсы не загрузились. */
  loadResourcesTimeout = 60000;
  /** Сколько по времени показывается экран с названием уровня. */
  gameIntroPopupTimeout = 2000;
  /** Через сколько после уничтожения последнего вражеского танка заканчивается игровой уровень. */
  missionAccomplishedRedirectTimeout = 1000;
  /** Сколько по времени горит надпись о проигрыше. */
  gameOverPopupTimeout = 3000;
  /** Сколько по времени показывается экран с очками. */
  scoreScreenTimeout = 7000;
  /** Сколько по времени действует бонус, укрепляющий стены вокруг базы. */
  wallsPowerupDuration = 10000;
  /** Сколько по времени действует бонус, дающий неуязвимость танку игрока. */
  shieldPowerupDuration = 10000;
  /** Сколько по времени действует бонус, замораживающий на месте вражеские танки. */
  freezePowerupDuration = 10000;

  load() {
    this.inited = true;
    this.paused = false;

    this.playerOne = {
      lives: this.defaultPlayerLives,
      upgradeTier: this.defaultPlayerUpgradeTier,
    };

    this.playerTwo = {
      lives: this.defaultPlayerLives,
      upgradeTier: this.defaultPlayerUpgradeTier,
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
