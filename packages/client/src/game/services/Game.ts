import { Entity, Projectile, Tank } from '../entities';
import { Direction, GameSettings, MainMenuState, ScenarioEvent, ScreenType } from '../typings';
import { Overlay } from '../ui';
import { levels } from './../data/levels';
import { Controller, resources, Scenario, View, Zone } from './';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';
import { Sound } from './Sound';

export class Game {
  static __instance: Game;
  inited = false;
  paused = false;
  zone!: Zone;
  view!: View;
  sound!: Sound;
  overlay!: Overlay;
  scenario?: Scenario;
  controllerAll!: Controller;
  controllerWasd!: Controller;
  controllerArrows!: Controller;
  loopProcess: ReturnType<typeof setTimeout> | null = null;
  loopTimeMs = 25;
  loopEntities: Set<Tank | Projectile> = new Set();
  settings: GameSettings = { width: 56, height: 56, boundarySize: 2 };
  screen: ScreenType = ScreenType.LOADING;
  mainMenuState = MainMenuState.SINGLEPLAYER;
  level = 1;
  maxLevels = levels.length;

  private constructor() {
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
    this.sound = new Sound();
    this.overlay = new Overlay(this.view);
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
    this.startLoop();
    this.controllerAll.load();
    this.controllerWasd.load();
    this.controllerArrows.load();
    this.inited = true;
  }

  unload() {
    this.stopLoop();
    this.controllerAll.unload();
    this.controllerWasd.unload();
    this.controllerArrows.unload();
    this.inited = false;
  }

  reset() {
    if (this.scenario) {
      delete this.scenario;
    }
    this.view.reset();
    this.zone.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();
    this.loopEntities = new Set();
  }

  createView(root: HTMLElement | null) {
    this.view.build(root);
  }

  addEntity(entity: Entity) {
    this.view.add(entity);
    this.zone.add(entity);
    this.sound.add(entity);
    if (entity instanceof Tank) {
      this.loopEntities.add(entity);
    } else if (entity instanceof Projectile) {
      const tempLoopEntitiesArray = Array.from(this.loopEntities);
      tempLoopEntitiesArray.unshift(entity);
      this.loopEntities = new Set(tempLoopEntitiesArray);
    }
  }

  loop() {
    const cycleStartTime = performance.now();
    let nextCycleDelay = this.loopTimeMs;
    for (const entity of this.loopEntities) {
      entity.update();
      if (entity.shouldBeDestroyed) {
        this.loopEntities.delete(entity);
      }
    }
    nextCycleDelay -= cycleStartTime - performance.now();
    if (nextCycleDelay < 0) {
      nextCycleDelay = 0;
    }
    this.loopProcess = setTimeout(this.loop.bind(this), nextCycleDelay);
  }

  togglePause(newState: boolean | null = null) {
    if (!this.inited) {
      return;
    }
    if (newState === false || this.paused) {
      this.startLoop();
      this.controllerWasd.load();
      this.controllerArrows.load();
    } else if (newState === true || !this.paused) {
      this.stopLoop();
      this.controllerWasd.unload();
      this.controllerArrows.unload();
    }
    this.paused = !this.paused;
  }

  startLoop() {
    this.stopLoop();
    this.loop();
  }

  stopLoop() {
    if (this.loopProcess) {
      clearTimeout(this.loopProcess);
      this.loopProcess = null;
    }
  }

  initLoading() {
    this.screen = ScreenType.LOADING;
    this.overlay.show(this.screen);
    resources.loadAll().then(() => this.initMenu());
  }

  initMenu() {
    this.screen = ScreenType.MAIN_MENU;
    this.overlay.show(this.screen, this.mainMenuState);

    this.controllerAll.reset();

    // Обрабатываем переходы по пунктам меню
    this.controllerAll
      .on('fullscreen', () => {
        this.view.toggleFullScreen();
      })
      .on('move', (direction: Direction) => {
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
      .on('shoot', () => {
        if (this.screen !== ScreenType.MAIN_MENU) {
          return;
        }

        // Открываем экран выбора уровня
        this.initLevelSelector();
      });
  }

  initLevelSelector() {
    this.screen = ScreenType.LEVEL_SELECTOR;

    this.overlay.show(this.screen, this.level);

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
        this.overlay.show(this.screen, this.level);
      }
    };

    this.controllerAll
      .on('stop', () => {
        if (this.screen == ScreenType.LEVEL_SELECTOR) {
          resetLevelInterval();
        }
      })
      .on('move', (direction: Direction) => {
        if (this.screen !== ScreenType.LEVEL_SELECTOR) {
          return;
        }

        resetLevelInterval();
        handleMove.call(this, direction);

        changeLevelInterval = setInterval(handleMove.bind(this, direction), 130);
      })
      .on('shoot', () => {
        if (this.screen !== ScreenType.LEVEL_SELECTOR) {
          return;
        }

        // Запускаем игру после выбора уровня
        this.initGameLevel();
      });
  }

  initGameOver() {
    const redirectDelay = 3000;
    this.screen = ScreenType.LOADING;

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

    /** Анимация перехода выбора уровня в игру */
    const startAnimationDelay = firstInit ? 2000 : 0;
    this.overlay.show(ScreenType.LEVEL_SELECTOR, this.level);
    this.overlay.show(this.screen, startAnimationDelay);

    /** Инициализируем сценарий инстанс сценария */
    this.scenario = new Scenario(this);
    this.scenario
      .on(ScenarioEvent.GAME_OVER, () => {
        this.initGameOver();
      })
      .on(ScenarioEvent.MISSION_ACCOMPLISHED, () => {
        if (this.level < this.maxLevels) {
          this.level++;
          this.initGameLevel(false);
        }
      });

    this.controllerAll
      .on('pause', () => {
        this.togglePause();
      })
      .on('fullscreen', () => {
        this.view.toggleFullScreen();
      });
  }
}
