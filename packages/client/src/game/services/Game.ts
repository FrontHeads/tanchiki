import { Entity } from '../entities';
import { ControllerEvent, Direction, GameSettings, MainMenuState, ScenarioEvent, ScreenType } from '../typings';
import { Overlay } from '../ui';
import { levels } from '../data/levels';
import { Controller, Loop, resources, Scenario, Statistics, View, Zone } from './';
import { AudioManager } from './AudioManager';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';
import { EventEmitter, sleep } from '../utils';

export class Game extends EventEmitter {
  static __instance: Game;
  inited = false;
  paused = false;
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
  settings: GameSettings = { width: 62, height: 56, boundarySize: 2, indicatorsSidebarSize: 6 };
  screen: ScreenType = ScreenType.Loading;
  mainMenuState = MainMenuState.SINGLEPLAYER;
  level = 1;
  maxLevels = levels.length;

  private constructor() {
    super();
    this.loop = new Loop();
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
    this.overlay = new Overlay(this);
    this.audioManager = new AudioManager();
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
    this.view.load(root);
    this.overlay.load();
    this.loop.load();
    this.audioManager.load();
    this.controllerAll.load();
    this.controllerWasd.load();
    this.controllerArrows.load();
    this.statistics.load();
    this.inited = true;
  }

  unload() {
    this.clearAllListeners();
    this.loop.unload();
    this.view.unload();
    this.overlay.unload();
    this.audioManager.unload();
    this.controllerAll.unload();
    this.controllerWasd.unload();
    this.controllerArrows.unload();
    this.statistics.unload();
    this.inited = false;
    this.paused = false;
  }

  reset() {
    if (this.scenario) {
      delete this.scenario;
    }
    this.loop.reset();
    this.zone.reset();
    this.view.reset();
    this.overlay.reset();
    this.audioManager.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();
    this.statistics.reset();
    this.paused = false;
  }

  addEntity(entity: Entity) {
    this.loop.add(entity);
    this.view.add(entity);
    this.zone.add(entity);
    this.audioManager.add(entity);
    this.statistics.add(entity);
  }

  togglePause(newState: boolean | null = null) {
    if (!this.inited) {
      return;
    }

    if (newState === false || this.paused) {
      this.overlay.clearScreen();
      this.loop.start();
      this.controllerWasd.load();
      this.controllerArrows.load();
    } else if (newState === true || !this.paused) {
      this.overlay.show(ScreenType.Pause);
      this.loop.stop();
      this.controllerWasd.unload();
      this.controllerArrows.unload();
    }
    this.paused = !this.paused;
    this.audioManager.emit('pause', this.paused);
  }

  initLoading() {
    this.screen = ScreenType.Loading;
    this.overlay.show(this.screen);
    resources.loadAll().then(() => {
      this.view.spriteImg = resources.getImage('classicDesignSprite'); //TODO: это нужно вынести в класс View
      this.initMenu();
    });
  }

  initMenu() {
    this.reset();

    this.screen = ScreenType.MainMenu;
    this.overlay.show(this.screen, this.mainMenuState);

    // Обрабатываем переходы по пунктам меню
    this.controllerAll
      .on(ControllerEvent.FULLSCREEN, () => {
        this.view.toggleFullScreen();
      })
      .on(ControllerEvent.MOVE, (direction: Direction) => {
        if (this.screen !== ScreenType.MainMenu) {
          return;
        }
        if (direction === Direction.UP) {
          this.mainMenuState = MainMenuState.SINGLEPLAYER;
        } else if (direction === Direction.DOWN) {
          this.mainMenuState = MainMenuState.MULTIPLAYER;
        }

        this.overlay.show(this.screen, this.mainMenuState);
      })
      // Обрабатываем нажатие на указанном пункте меню
      .on(ControllerEvent.SHOOT, async () => {
        if (this.screen !== ScreenType.MainMenu) {
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

      this.screen = ScreenType.LevelSelector;
      this.overlay.show(ScreenType.LevelSelector, { level: this.level, showHints: true });

      /** Объект setInterval для обработки непрерывного изменения уровня */
      let changeLevelInterval: ReturnType<typeof setInterval>;

      const resetLevelInterval = () => changeLevelInterval && clearInterval(changeLevelInterval);
      const handleMove = (direction: Direction) => {
        let shouldTrigger = false;
        if ((direction === Direction.UP || direction === Direction.RIGHT) && this.level < this.maxLevels) {
          this.level++;
          shouldTrigger = true;
        } else if ((direction === Direction.DOWN || direction === Direction.LEFT) && this.level > 1) {
          this.level--;
          shouldTrigger = true;
        } else {
          resetLevelInterval();
        }
        // Триггерим обновление экрана выбора уровня только в случае изменения значения уровня
        if (shouldTrigger) {
          this.overlay.show(ScreenType.LevelSelector, { level: this.level });
        }
      };

      this.controllerAll
        .on(ControllerEvent.STOP, () => {
          if (this.screen === ScreenType.LevelSelector) {
            resetLevelInterval();
          }
        })
        .on(ControllerEvent.MOVE, (direction: Direction) => {
          if (this.screen !== ScreenType.LevelSelector) {
            return;
          }

          resetLevelInterval();
          handleMove.call(this, direction);

          changeLevelInterval = setInterval(handleMove.bind(this, direction), 130);
        })
        .on(ControllerEvent.SHOOT, () => {
          if (this.screen !== ScreenType.LevelSelector) {
            return;
          }
          resolve();
        })
        .on(ControllerEvent.ESCAPE, () => {
          this.initMenu();
        });
    });
  }

  /** Анимация перехода с экрана выбора уровня в игру */
  initGameIntro() {
    return new Promise<void>(resolve => {
      const startAnimationDelay = 2000;

      this.overlay.show(ScreenType.LevelSelector, { level: this.level, showHints: false });
      this.audioManager.emit('levelIntro');

      this.controllerAll.on(ControllerEvent.SHOOT, resolve);
      setTimeout(resolve, startAnimationDelay);
    }).then(() => {
      this.controllerAll.offAll(ControllerEvent.SHOOT);
      this.screen = ScreenType.GameStart;
      this.overlay.show(this.screen);
    });
  }

  async initGameLevel(firstInit = false) {
    this.reset();

    if (firstInit) {
      this.statistics.startSession(this.mainMenuState === MainMenuState.SINGLEPLAYER ? 'SINGLEPLAYER' : 'MULTIPLAYER');
    } else {
      if (this.level < this.maxLevels) {
        this.level++;
      } else {
        this.level = 1;
      }
    }

    await this.initGameIntro();

    this.statistics.startMap();

    /** Инициализируем инстанс сценария */
    this.scenario = new Scenario(this)
      .on(ScenarioEvent.GAME_OVER, async () => {
        this.statistics.finishSession();
        await this.initGameOverPopup();
        await this.initGameScore();
        this.initMenu();
      })
      .on(ScenarioEvent.MISSION_ACCOMPLISHED, async () => {
        const missionAccomplishedDelay = 1000;
        await sleep(missionAccomplishedDelay);
        this.statistics.finishMap();
        await this.initGameScore();
        this.initGameLevel();
      });

    this.controllerAll
      .on(ControllerEvent.PAUSE, () => {
        this.togglePause();
      })
      .on(ControllerEvent.MUTE, () => {
        this.audioManager.emit('pause', { isMuteKey: true });
      })
      .on(ControllerEvent.FULLSCREEN, () => {
        this.view.toggleFullScreen();
      });
  }

  initGameScore() {
    return new Promise<void>(resolve => {
      const stats = this.statistics.getCurrentStatistics();
      this.reset();
      this.screen = ScreenType.Score;
      this.overlay.show(this.screen, { level: this.level, ...stats });
      const redirectDelay = 7000;

      this.overlay.on('score', () => {
        this.audioManager.emit('score');
      });

      const skip = () => {
        this.overlay.show(this.screen, { level: this.level, ...stats, skip: true });
        this.controllerAll.offAll(ControllerEvent.ESCAPE);
        this.controllerAll.on(ControllerEvent.ESCAPE, resolve);
        this.controllerAll.offAll(ControllerEvent.SHOOT);
        this.controllerAll.on(ControllerEvent.SHOOT, resolve);
      };

      this.controllerAll.on(ControllerEvent.ESCAPE, skip);
      this.controllerAll.on(ControllerEvent.SHOOT, skip);
      setTimeout(resolve, redirectDelay);
    });
  }

  initGameOverPopup() {
    return new Promise<void>(resolve => {
      if (this.screen === ScreenType.GameOverPopup) {
        return;
      }

      const redirectDelay = 3000;
      this.screen = ScreenType.GameOverPopup;
      this.overlay.show(this.screen);
      this.audioManager.emit('gameOver');

      this.controllerAll.reset();
      this.controllerWasd.reset();
      this.controllerArrows.reset();

      this.controllerAll.on(ControllerEvent.ESCAPE, resolve);
      setTimeout(resolve, redirectDelay);
    });
  }
}
