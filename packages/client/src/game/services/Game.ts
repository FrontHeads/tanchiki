import { Entity, Projectile, Tank } from '../entities';
import {
  Direction,
  GameSettings,
  LoopDelays,
  LoopIntervals,
  MainMenuState,
  ScenarioEvent,
  ScreenType,
} from '../typings';
import { Overlay } from '../ui';
import { levels } from './../data/levels';
import { Controller, resources, Scenario, View, Zone } from './';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';

export class Game {
  static __instance: Game;
  inited = false;
  paused = false;
  zone!: Zone;
  view!: View;
  overlay!: Overlay;
  scenario: Scenario | undefined;
  controllerAll!: Controller;
  controllerWasd!: Controller;
  controllerArrows!: Controller;
  loopProcess: ReturnType<typeof setTimeout> | null = null;
  loopTimeMs = 25;
  loopCount = 0;
  loopDelays: LoopDelays = {};
  loopIntervals: LoopIntervals = {};
  loopEntities: Set<Tank | Projectile> = new Set();
  settings: GameSettings = { width: 56, height: 56, boundarySize: 2 };
  screen: ScreenType = ScreenType.LOADING;
  mainMenuState = MainMenuState.SINGLEPLAYER;
  level = 1;
  maxLevels = levels.length;

  private constructor() {
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
    this.overlay = new Overlay(this.view, this);
    this.controllerAll = new Controller({ ...KeyBindingsWasd, ...KeyBindingsArrows });
    this.controllerWasd = new Controller(KeyBindingsWasd);
    this.controllerArrows = new Controller(KeyBindingsArrows);
  }

  static getInstance() {
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
    this.clearLoopEntities();
    this.clearLoopDelays();
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
    this.clearLoopEntities();
    this.loopIntervals = {};
    this.clearLoopDelays();
    this.view.reset();
    this.zone.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();
  }

  createView(root: HTMLElement | null) {
    this.view.build(root);
  }

  addEntity(entity: Entity) {
    this.view.add(entity);
    this.zone.add(entity);
    this.registerLoopDelays(entity);
    if (entity instanceof Tank) {
      this.loopEntities.add(entity);
    } else if (entity instanceof Projectile) {
      const tempLoopEntitiesArray = Array.from(this.loopEntities);
      tempLoopEntitiesArray.unshift(entity);
      this.loopEntities = new Set(tempLoopEntitiesArray);
    }
  }

  clearLoopEntities() {
    for (const entity of this.loopEntities) {
      entity.despawn();
    }
    this.loopEntities = new Set();
  }

  convertTimeToLoops(delay: number) {
    return ~~(delay / this.loopTimeMs); // ~~ это Math.floor()
  }

  /** Аналог setTimeout, который работает через игровой цикл */
  setLoopDelay(callback: () => void, delay: number) {
    const loopMark = this.loopCount + this.convertTimeToLoops(delay);

    if (!this.loopDelays[loopMark]) {
      this.loopDelays[loopMark] = new Set();
    }

    this.loopDelays[loopMark].add(callback);
  }

  setLoopInterval(callback: () => void, delay: number, intervalName: string | number) {
    this.loopIntervals[intervalName] = {
      loopCounter: 0,
      targetLoop: this.convertTimeToLoops(delay),
      callback: callback,
    };

    return intervalName;
  }

  clearLoopInterval(intervalName: string | number) {
    if (intervalName in this.loopIntervals) {
      delete this.loopIntervals[intervalName];
    }
  }

  registerLoopDelays(entity: Entity) {
    entity.on('loopDelay', this.setLoopDelay.bind(this));
    entity.on('loopInterval', this.setLoopInterval.bind(this));
    entity.on('clearLoopInterval', this.clearLoopInterval.bind(this));
  }

  clearLoopDelays() {
    this.loopCount = 0;
    this.loopDelays = {};
  }

  checkLoopDelays() {
    if (this.loopDelays[this.loopCount]) {
      const delayedCallbacks = this.loopDelays[this.loopCount];
      for (const callback of delayedCallbacks) {
        callback();
      }
      delete this.loopDelays[this.loopCount];
    }
  }

  checkLoopIntervals() {
    Object.values(this.loopIntervals).forEach(interval => {
      if (interval.loopCounter === interval.targetLoop) {
        interval.callback();
        interval.loopCounter = 0;
        return;
      }
      interval.loopCounter++;
    });
  }

  loop() {
    const cycleStartTime = performance.now();
    let nextCycleDelay = this.loopTimeMs;
    ++this.loopCount;
    this.checkLoopDelays();
    this.checkLoopIntervals();
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
    resources.loadAll().then(() => {
      this.view.spriteImg = resources.getImage('classicDesignSprite');
      this.initMenu();
    });
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
    this.reset();

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

    /** Анимация перехода выбора уровня в игру */
    const startAnimationDelay = firstInit ? 0 : 2000;
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
          this.initGameLevel();
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
