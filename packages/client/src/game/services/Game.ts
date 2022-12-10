import { Projectile, Tank } from '../entities';
import { Direction, GameSettings, MainMenuState, ScenarioEvent, ScreenType } from '../typings';
import { Overlay } from '../ui';
import { Controller, Scenario, View, Zone } from './';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';

export class Game {
  static __instance: Game;
  inited = false;
  paused = false;
  zone!: Zone;
  view!: View;
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
  // TODO: сюда надо будет подгрузить уровни + сделать нормальную типизацию объекта
  // Массив с настройками уровней
  levels: Record<string, unknown>[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
  ];

  private constructor() {
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
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

  createView(root: HTMLElement | null) {
    this.view.build(root);
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
    const redirectDelay = 500;
    this.screen = ScreenType.LOADING;
    this.overlay.show(this.screen);

    this.view.offAll('assetsLoaded');
    this.view.on('assetsLoaded', () => {
      setTimeout(() => {
        this.initMenu();
      }, redirectDelay);
    });
  }

  initMenu() {
    this.screen = ScreenType.MAIN_MENU;
    this.overlay.show(this.screen, this.mainMenuState);

    this.controllerAll.reset();

    // Обрабатываем переходы по пунктам меню
    this.controllerAll.on('move', (direction: Direction) => {
      if (this.screen !== ScreenType.MAIN_MENU) {
        return;
      }
      if (direction === Direction.UP) {
        this.mainMenuState = MainMenuState.SINGLEPLAYER;
      } else if (direction === Direction.DOWN) {
        this.mainMenuState = MainMenuState.MULTIPLAYER;
      }

      this.overlay.show(this.screen, this.mainMenuState);
    });

    // Обрабатываем нажатие на указанном пункте меню
    this.controllerAll.on('shoot', () => {
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

    this.controllerAll.on('stop', () => {
      if (this.screen == ScreenType.LEVEL_SELECTOR) {
        resetLevelInterval();
      }
    });

    this.controllerAll.on('move', (direction: Direction) => {
      if (this.screen !== ScreenType.LEVEL_SELECTOR) {
        return;
      }

      resetLevelInterval();

      changeLevelInterval = setInterval(() => {
        let shouldTrigger = false;
        if (direction === Direction.UP && this.level < this.levels.length) {
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
      }, 100);
    });

    this.controllerAll.on('shoot', () => {
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

  initGameLevel() {
    this.screen = ScreenType.GAME;
    this.view.reset();
    this.zone.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();

    // Анимация перехода выбора уровня в игру
    this.overlay.show(ScreenType.LEVEL_SELECTOR, this.level);
    this.overlay.show(this.screen, this.level);

    this.scenario = new Scenario(this);
    this.scenario.on(ScenarioEvent.GAME_OVER, () => {
      this.initGameOver();
    });

    this.controllerAll.on('pause', () => {
      this.togglePause();
    });
  }
}
