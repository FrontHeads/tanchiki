import { type Entity } from '../../entities';
import { Direction } from '../../entities/Entity/typings';
import { Overlay } from '../../ui';
import { ScreenType } from '../../ui/screens/data';
import { MainMenuState } from '../../ui/screens/UIScreens/data';
import { EventEmitter, sleep } from '../../utils';
import {
  AudioManager,
  Controller,
  ControllerEvent,
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
import { KeyBindingsArrows, KeyBindingsWasd } from '../Controller/KeyBindings';
import { type StatisticsData } from '../Statistics/typings';
import { GameEvents } from './data';

export { GameEvents };

export class Game extends EventEmitter {
  static __instance: Game;
  state: State;
  resources: Resources;
  loop: Loop;
  zone: Zone;
  view: View;
  audioManager: AudioManager;
  overlay: Overlay;
  scenario: Scenario | undefined;
  controllerAll: Controller;
  controllerWasd: Controller;
  controllerArrows: Controller;
  statistics: Statistics;

  private constructor() {
    super();
    this.state = new State();
    this.resources = new Resources(this);
    this.loop = new Loop();
    this.zone = new Zone(this);
    this.view = new View(this);
    this.overlay = new Overlay(this);
    this.audioManager = new AudioManager(this);
    this.controllerAll = new Controller({ ...KeyBindingsWasd, ...KeyBindingsArrows });
    this.controllerWasd = new Controller(KeyBindingsWasd);
    this.controllerArrows = new Controller(KeyBindingsArrows);
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
    this.resources.load();
    this.view.load(root);
    this.overlay.load();
    this.loop.load();
    this.audioManager.load();
    this.controllerAll.load();
    this.controllerWasd.load();
    this.controllerArrows.load();
    this.statistics.load();
  }

  unload() {
    this.clearAllListeners();
    this.state.unload();
    this.loop.unload();
    this.view.unload();
    this.overlay.unload();
    this.audioManager.unload();
    this.controllerAll.unload();
    this.controllerWasd.unload();
    this.controllerArrows.unload();
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
    this.controllerWasd.reset();
    this.controllerArrows.reset();
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
      this.controllerWasd.load();
      this.controllerArrows.load();
      this.statistics.startTimer();
    } else if (newState === true || !this.state.paused) {
      this.overlay.show(ScreenType.Pause);
      this.loop.stop();
      this.controllerWasd.unload();
      this.controllerArrows.unload();
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
    this.overlay.show(this.state.screen, this.state.mainMenuState);

    // Обрабатываем переходы по пунктам меню
    this.controllerAll
      .on(ControllerEvent.Fullscreen, () => {
        this.view.toggleFullScreen();
      })
      .on(ControllerEvent.Move, (direction: Direction) => {
        if (this.state.screen !== ScreenType.MainMenu) {
          return;
        }
        if (direction === Direction.Up) {
          this.state.mainMenuState = MainMenuState.Singleplayer;
        } else if (direction === Direction.Down) {
          this.state.mainMenuState = MainMenuState.Multiplayer;
        }

        this.overlay.show(this.state.screen, this.state.mainMenuState);
      })
      // Обрабатываем нажатие на указанном пункте меню
      .on(ControllerEvent.Shoot, async () => {
        if (this.state.screen !== ScreenType.MainMenu) {
          return;
        }

        // Открываем экран выбора уровня
        await this.initLevelSelector();

        // Запускаем игру после выбора уровня
        this.initGameLevel(true);
      });
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

    this.state.mode = this.state.mainMenuState === MainMenuState.Singleplayer ? 'SINGLEPLAYER' : 'MULTIPLAYER';

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
      })
      .on(ControllerEvent.Mute, () => {
        this.audioManager.emit('pause', { isMuteKey: true });
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

      this.controllerAll.on(ControllerEvent.Escape, skip);
      this.controllerAll.on(ControllerEvent.Shoot, skip);
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
      this.controllerWasd.reset();
      this.controllerArrows.reset();

      this.controllerAll.on(ControllerEvent.Escape, resolve);
      setTimeout(resolve, this.state.gameOverPopupTimeout);
    });
  }
}
