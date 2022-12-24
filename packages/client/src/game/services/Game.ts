import { Entity } from '../entities';
import { Direction, GameSettings, MainMenuState, ScenarioEvent, ScreenType } from '../typings';
import { Overlay } from '../ui';
import { levels } from './../data/levels';
import { ControllerEvent } from './../typings/index';
import { Controller, Loop, resources, Scenario, View, Zone } from './';
import { AudioManager } from './AudioManager';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';

export class Game {
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
  settings: GameSettings = { width: 56, height: 56, boundarySize: 2 };
  screen: ScreenType = ScreenType.LOADING;
  mainMenuState = MainMenuState.SINGLEPLAYER;
  level = 1;
  maxLevels = levels.length;

  private constructor() {
    this.loop = new Loop();
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
    this.overlay = new Overlay(this);
    this.audioManager = new AudioManager();
    this.controllerAll = new Controller({ ...KeyBindingsWasd, ...KeyBindingsArrows });
    this.controllerWasd = new Controller(KeyBindingsWasd);
    this.controllerArrows = new Controller(KeyBindingsArrows);
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
    this.createView(root);
    this.loop.load();
    this.controllerAll.load();
    this.controllerWasd.load();
    this.controllerArrows.load();
    this.inited = true;
  }

  unload() {
    this.loop.unload();
    this.controllerAll.unload();
    this.controllerWasd.unload();
    this.controllerArrows.unload();
    this.inited = false;
  }

  reset() {
    if (this.scenario) {
      delete this.scenario;
    }
    this.loop.reset();
    this.view.reset();
    this.zone.reset();
    this.audioManager.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();
  }

  createView(root: HTMLElement | null) {
    this.view.build(root);
  }

  addEntity(entity: Entity) {
    this.loop.add(entity);
    this.view.add(entity);
    this.zone.add(entity);
    this.audioManager.add(entity);
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
      this.overlay.show(ScreenType.PAUSE);
      this.loop.stop();
      this.controllerWasd.unload();
      this.controllerArrows.unload();
    }
    this.paused = !this.paused;
    this.audioManager.emit('pause', this.paused);
  }

  initLoading() {
    this.screen = ScreenType.LOADING;
    this.overlay.show(this.screen);
    resources.loadAll().then(() => {
      this.view.spriteImg = resources.getImage('classicDesignSprite');
      this.initMenu();
    });
  }

  initMenu() {
    this.screen = ScreenType.MAIN_MENU;

    this.reset();
    this.overlay.show(this.screen, this.mainMenuState);

    // Обрабатываем переходы по пунктам меню
    this.controllerAll
      .on(ControllerEvent.FULLSCREEN, () => {
        this.view.toggleFullScreen();
      })
      .on(ControllerEvent.MOVE, (direction: Direction) => {
        if (this.screen !== ScreenType.MAIN_MENU) {
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
      .on(ControllerEvent.SHOOT, () => {
        if (this.screen !== ScreenType.MAIN_MENU) {
          return;
        }

        // Открываем экран выбора уровня
        this.initLevelSelector();
      });
  }

  initLevelSelector() {
    this.reset();

    this.screen = ScreenType.LEVEL_SELECTOR;

    this.overlay.show(ScreenType.LEVEL_SELECTOR, { level: this.level, showHints: true });

    this.controllerAll.reset();

    /** Объект setInterval для обработки непрерывного изменения уровня */
    let changeLevelInterval: ReturnType<typeof setInterval>;

    const resetLevelInterval = () => changeLevelInterval && clearInterval(changeLevelInterval);
    const handleMove = (direction: Direction) => {
      let shouldTrigger = false;
      if (direction === Direction.UP && this.level < this.maxLevels) {
        this.level++;
        shouldTrigger = true;
      } else if (direction === Direction.DOWN && this.level > 1) {
        this.level--;
        shouldTrigger = true;
      } else {
        resetLevelInterval();
      }
      // Триггерим обновление экрана выбора уровня только в случае изменения значения уровня
      if (shouldTrigger) {
        this.overlay.show(ScreenType.LEVEL_SELECTOR, { level: this.level });
      }
    };

    this.controllerAll
      .on(ControllerEvent.STOP, () => {
        if (this.screen === ScreenType.LEVEL_SELECTOR) {
          resetLevelInterval();
        }
      })
      .on(ControllerEvent.MOVE, (direction: Direction) => {
        if (this.screen !== ScreenType.LEVEL_SELECTOR) {
          return;
        }

        resetLevelInterval();
        handleMove.call(this, direction);

        changeLevelInterval = setInterval(handleMove.bind(this, direction), 130);
      })
      .on(ControllerEvent.SHOOT, () => {
        if (this.screen !== ScreenType.LEVEL_SELECTOR) {
          return;
        }

        // Запускаем игру после выбора уровня
        this.initGameLevel(true);
      });
  }

  initGameOver() {
    const redirectDelay = 3000;
    this.screen = ScreenType.GAME_OVER;

    this.overlay.show(this.screen);

    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();

    setTimeout(() => {
      this.initMenu();
    }, redirectDelay);
  }

  initGameLevel(firstInit = false) {
    this.screen = ScreenType.GAME;
    this.reset();

    /** Анимация перехода с экрана выбора уровня в игру */
    const startAnimationDelay = firstInit ? 100 : 2000;
    this.overlay.show(ScreenType.LEVEL_SELECTOR, { level: this.level, showHints: false });
    this.overlay.show(this.screen, startAnimationDelay);

    /** Стартуем сценарий после окончания анимации */
    this.loop.setLoopDelay(() => {
      /** Инициализируем инстанс сценария */
      this.scenario = new Scenario(this)
        .on(ScenarioEvent.GAME_OVER, () => {
          this.initGameOver();
        })
        .on(ScenarioEvent.MISSION_ACCOMPLISHED, () => {
          if (this.level < this.maxLevels) {
            this.level++;
            this.initGameLevel();
          } else {
            this.level = 1;
          }
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
    }, startAnimationDelay);

    this.audioManager.emit('levelIntro');
  }
}
