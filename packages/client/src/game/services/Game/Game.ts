import { type Entity } from '../../entities';
import { Direction } from '../../entities/Entity/typings';
import { Overlay } from '../../ui';
import { ScreenType } from '../../ui/screens/data';
import { MainMenuItem } from '../../ui/screens/UIScreens/data';
import { EventEmitter, sleep } from '../../utils';
import { isTouchscreen } from '../../utils/isTouchscreen';
import {
  AudioManager,
  ControllerKeyboard,
  ControllerManager,
  ControllerPointer,
  ControllerStick,
  Debug,
  Loop,
  Resources,
  ResourcesEvent,
  Scenario,
  ScenarioEvent,
  State,
  Statistics,
  View,
  Zone,
} from '../';
import { type Controller, ControllerEvent, ServiceButtonsName } from '../Controller';
import {
  type BindingConfig,
  KeyBindingsArrows,
  KeyBindingsWasd,
  PointerBindings,
  StickBindings,
} from '../Controller/KeyBindings';
import { type StatisticsData } from '../Statistics/typings';
import { ViewEvents } from '../View/data';
import { GameDifficulty, GameEvents } from './data';

export { type GameMode } from './typings';
export { GameDifficulty, GameEvents };

export class Game extends EventEmitter {
  static __instance: Game;
  state: State;
  debug: Debug;
  resources: Resources;
  loop: Loop;
  zone: Zone;
  view: View;
  audioManager: AudioManager;
  overlay: Overlay;
  scenario: Scenario | undefined;
  controllerAll: Controller;
  controllerPlayerOne: Controller;
  controllerPlayerTwo: Controller;
  statistics: Statistics;

  private constructor() {
    super();
    this.state = new State();
    this.debug = new Debug(this);
    this.resources = new Resources(this);
    this.loop = new Loop();
    this.zone = new Zone(this);
    this.view = new View(this);
    this.overlay = new Overlay(this);
    this.audioManager = new AudioManager(this);
    this.controllerAll = this.createController({ ...KeyBindingsWasd, ...KeyBindingsArrows });
    this.controllerPlayerOne = this.createController(KeyBindingsWasd);
    this.controllerPlayerTwo = new ControllerKeyboard(KeyBindingsArrows);
    this.statistics = new Statistics(this);
  }

  static create() {
    if (!Game.__instance) {
      Game.__instance = new Game();
    }
    return Game.__instance;
  }

  init(root: HTMLElement | null) {
    this.unload();

    this.load(root);

    this.initLoading();
  }

  load(root: HTMLElement | null) {
    this.state.load();
    this.debug.load();
    this.resources.load();
    this.view.load(root);
    this.overlay.load();
    this.loop.load();
    this.audioManager.load();
    this.controllerAll.load();
    this.controllerPlayerOne.load();
    this.controllerPlayerTwo.load();
    this.statistics.load();
  }

  unload() {
    this.clearAllListeners();
    this.state.unload();
    this.debug.unload();
    this.loop.unload();
    this.view.unload();
    this.overlay.unload();
    this.audioManager.unload();
    this.controllerAll.unload();
    this.controllerPlayerOne.unload();
    this.controllerPlayerTwo.unload();
    this.statistics.unload();
  }

  reset() {
    if (this.scenario) {
      delete this.scenario;
    }
    this.state.reset();
    this.loop.reset();
    this.zone.reset();
    this.view.reset();
    this.overlay.reset();
    this.audioManager.reset();
    this.controllerAll.reset();
    this.controllerPlayerOne.reset();
    this.controllerPlayerTwo.reset();
    this.statistics.reset();
  }

  addEntity(entity: Entity) {
    this.loop.add(entity);
    this.view.add(entity);
    this.zone.add(entity);
    this.audioManager.add(entity);
    this.statistics.add(entity);
  }

  /** Эмитит событие с данными, которое отлавливается на странице с игрой для обновления лидерборда. */
  updateLeaderboard(data: StatisticsData) {
    if (this.state.username) {
      this.emit(GameEvents.UpdateLeaderboard, { username: this.state.username, ...data });
    }
  }

  togglePause(newState: boolean | null = null) {
    if (!this.state.inited) {
      return;
    }

    if (newState === false || this.state.paused) {
      this.overlay.clearScreen();
      this.loop.start();
      this.controllerPlayerOne.load();
      this.controllerPlayerTwo.load();
      this.statistics.startTimer();
    } else if (newState === true || !this.state.paused) {
      this.overlay.show(ScreenType.Pause);
      this.loop.stop();
      this.controllerPlayerOne.unload();
      this.controllerPlayerTwo.unload();
      this.statistics.stopTimer();
    }
    this.state.paused = !this.state.paused;
    this.audioManager.emit('pause', this.state.paused);
  }

  initLoading() {
    this.state.screen = ScreenType.Loading;
    this.overlay.show(this.state.screen);

    this.resources.on(ResourcesEvent.Loaded, () => {
      this.initMenu();
    });
  }

  initMenu() {
    this.reset();

    this.state.screen = ScreenType.MainMenu;
    this.overlay.show(this.state.screen, this.state.mainMenuItem);

    // Обрабатываем переходы по пунктам меню
    this.controllerAll
      .on(ControllerEvent.Fullscreen, () => {
        this.view.toggleFullScreen();
      })
      .on(ControllerEvent.Move, (direction: Direction) => {
        if (this.state.screen !== ScreenType.MainMenu) {
          return;
        }

        if (direction === Direction.Up || direction === Direction.Down) {
          this.overlay.changeMainMenuItem(direction);
        }

        if (direction === Direction.Left || direction === Direction.Right) {
          if (this.state.mainMenuItem === MainMenuItem.Style) {
            this.view.changeGameTheme();
          }
          if (this.state.mainMenuItem === MainMenuItem.Difficulty) {
            this.changeGameDifficulty();
          }
          if (this.state.mainMenuItem === MainMenuItem.JoystickType && this.controllerAll.changeJoystickType) {
            this.controllerAll.changeJoystickType();
          }
        }

        this.overlay.show(this.state.screen, this.state.mainMenuItem);
      })
      // Обрабатываем нажатие на указанном пункте меню
      .on(ControllerEvent.Shoot, async () => {
        if (this.state.screen !== ScreenType.MainMenu) {
          return;
        }

        if (this.state.mainMenuItem === MainMenuItem.Style) {
          this.view.changeGameTheme();
          this.overlay.show(this.state.screen, this.state.mainMenuItem);
          return;
        }
        if (this.state.mainMenuItem === MainMenuItem.Difficulty) {
          this.changeGameDifficulty();
          this.overlay.show(this.state.screen, this.state.mainMenuItem);
          return;
        }
        if (this.state.mainMenuItem === MainMenuItem.JoystickType && this.controllerAll.changeJoystickType) {
          this.controllerAll.changeJoystickType();
          this.overlay.show(this.state.screen, this.state.mainMenuItem);
          return;
        }

        // Открываем экран выбора уровня
        await this.initLevelSelector();

        // Запускаем игру после выбора уровня
        this.initGameLevel(true);
        this.emit(ViewEvents.ToggleVisibilityServiceBtn);
      });
  }

  changeGameDifficulty() {
    if (this.state.difficulty === GameDifficulty.Easy) {
      this.state.difficulty = GameDifficulty.Hard;
    } else {
      this.state.difficulty = GameDifficulty.Easy;
    }
  }

  initLevelSelector() {
    return new Promise<void>(resolve => {
      this.reset();

      this.state.screen = ScreenType.LevelSelector;
      this.overlay.show(ScreenType.LevelSelector, { level: this.state.level, showHints: true });

      /** Объект setInterval для обработки непрерывного изменения уровня */
      let changeLevelInterval: ReturnType<typeof setInterval>;

      const resetLevelInterval = () => changeLevelInterval && clearInterval(changeLevelInterval);
      const handleMove = (direction: Direction) => {
        let shouldTrigger = false;
        if ((direction === Direction.Up || direction === Direction.Right) && this.state.level < this.state.maxLevels) {
          this.state.level++;
          shouldTrigger = true;
        } else if ((direction === Direction.Down || direction === Direction.Left) && this.state.level > 1) {
          this.state.level--;
          shouldTrigger = true;
        } else {
          resetLevelInterval();
        }
        // Триггерим обновление экрана выбора уровня только в случае изменения значения уровня
        if (shouldTrigger) {
          this.overlay.show(ScreenType.LevelSelector, { level: this.state.level });
        }
      };

      this.controllerAll
        .on(ControllerEvent.Stop, () => {
          if (this.state.screen === ScreenType.LevelSelector) {
            resetLevelInterval();
          }
        })
        .on(ControllerEvent.Move, (direction: Direction) => {
          if (this.state.screen !== ScreenType.LevelSelector) {
            return;
          }

          resetLevelInterval();
          handleMove.call(this, direction);

          changeLevelInterval = setInterval(handleMove.bind(this, direction), 130);
        })
        .on(ControllerEvent.Shoot, () => {
          if (this.state.screen !== ScreenType.LevelSelector) {
            return;
          }
          resolve();
        })
        .on(ControllerEvent.Escape, () => {
          this.initMenu();
        })
        .on(ControllerEvent.Fullscreen, () => {
          this.view.toggleFullScreen();
        });
    });
  }

  /** Анимация перехода с экрана выбора уровня в игру */
  initGameIntro() {
    return new Promise<void>(resolve => {
      this.overlay.show(ScreenType.LevelSelector, { level: this.state.level, showHints: false });
      this.audioManager.emit('levelIntro');

      this.controllerAll.on(ControllerEvent.Pause, resolve);
      this.controllerAll.on(ControllerEvent.Shoot, resolve);
      setTimeout(resolve, this.state.gameIntroPopupTimeout);
    }).then(() => {
      this.controllerAll.offAll(ControllerEvent.Shoot);
      this.state.screen = ScreenType.GameStart;
      this.overlay.show(this.state.screen);
    });
  }

  async initGameLevel(firstInit = false) {
    this.reset();

    this.state.mode =
      this.state.mainMenuItem === MainMenuItem.Singleplayer ? MainMenuItem.Singleplayer : MainMenuItem.Multiplayer;

    if (firstInit) {
      this.statistics.startSession(this.state.mode);
    } else {
      if (this.state.level < this.state.maxLevels) {
        this.state.level++;
      } else {
        this.state.level = 1;
      }
    }

    this.controllerAll
      .on(ControllerEvent.Pause, () => {
        this.togglePause();
        this.view.emit(ViewEvents.ToggleColorServiceBtn, ServiceButtonsName.Pause);
      })
      .on(ControllerEvent.Mute, () => {
        this.audioManager.emit('pause', { isMuteKey: true });
        this.view.emit(ViewEvents.ToggleColorServiceBtn, ServiceButtonsName.Mute);
      })
      .on(ControllerEvent.Fullscreen, () => {
        this.view.toggleFullScreen();
      });

    await this.initGameIntro();

    this.statistics.startMap();

    /** Инициализируем инстанс сценария */
    this.scenario = new Scenario(this)
      .on(ScenarioEvent.GameOver, async () => {
        this.statistics.finishSession();
        this.state.resetSession();
        await this.initGameOverPopup();
        await this.initGameScore();
        this.initMenu();
      })
      .on(ScenarioEvent.MissionAccomplished, async () => {
        this.statistics.finishMap();
        this.controllerAll.offAll(ControllerEvent.Pause);
        await sleep(this.state.missionAccomplishedRedirectTimeout);
        await this.initGameScore();
        this.initGameLevel();
      });
  }

  initGameScore() {
    return new Promise<void>(resolve => {
      const meta = { level: this.state.level, username: this.state.username };
      const stats = this.statistics.getCurrentStatistics();
      this.reset();
      this.state.screen = ScreenType.Score;
      this.overlay.show(this.state.screen, { ...meta, ...stats });

      this.overlay.on('score', () => {
        this.audioManager.emit('score');
      });

      const skip = () => {
        this.overlay.show(this.state.screen, { ...meta, ...stats, skip: true });
        this.controllerAll.offAll(ControllerEvent.Escape);
        this.controllerAll.on(ControllerEvent.Escape, resolve);
        this.controllerAll.offAll(ControllerEvent.Shoot);
        this.controllerAll.on(ControllerEvent.Shoot, resolve);
      };

      this.controllerAll
        .on(ControllerEvent.Fullscreen, () => {
          this.view.toggleFullScreen();
        })
        .on(ControllerEvent.Escape, skip)
        .on(ControllerEvent.Shoot, skip);
      setTimeout(resolve, this.state.scoreScreenTimeout);
    });
  }

  initGameOverPopup() {
    return new Promise<void>(resolve => {
      if (this.state.screen === ScreenType.GameOverPopup) {
        return;
      }

      this.state.screen = ScreenType.GameOverPopup;
      this.overlay.show(this.state.screen);
      this.audioManager.emit('gameOver');

      this.controllerAll.reset();
      this.controllerPlayerOne.reset();
      this.controllerPlayerTwo.reset();

      this.emit(ViewEvents.ToggleVisibilityServiceBtn);
      this.controllerAll.on(ControllerEvent.Escape, resolve);
      setTimeout(resolve, this.state.gameOverPopupTimeout);
    });
  }

  private createController(keyBinding: BindingConfig) {
    if (isTouchscreen()) {
      return new ControllerManager(this, [
        new ControllerStick(StickBindings),
        new ControllerPointer({
          pointerBindings: PointerBindings,
          type: 'touchscreen',
        }),
      ]);
    }

    return new ControllerManager(this, [
      new ControllerKeyboard(keyBinding),
      new ControllerPointer({
        pointerBindings: PointerBindings,
        type: 'mouse',
      }),
    ]);
  }
}
