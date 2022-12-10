import { Entity, Flag, Projectile, Tank, Terrain } from '../entities';
import { Direction, EntityDynamicSettings, EntitySettings, GameSettings, MainMenuState } from '../typings';
import { Overlay } from '../ui';
import { Controller, View, Zone } from './';
import { KeyBindingsArrows, KeyBindingsWasd } from './KeyBindings';

export class Game {
  static __instance: Game;
  inited = false;
  paused = false;
  zone!: Zone;
  view!: View;
  overlay!: Overlay;
  controllerAll!: Controller;
  controllerWasd!: Controller;
  controllerArrows!: Controller;
  loopProcess: ReturnType<typeof setTimeout> | null = null;
  loopTimeMs = 25;
  loopEntities: Set<Tank | Projectile> = new Set();
  settings: GameSettings = { width: 56, height: 56, boundarySize: 2 };
  mode: 'loading' | 'menu' | 'game' | 'select-level' = 'loading';
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
        this.destroyEntity(entity);
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

  createTank(props: EntityDynamicSettings, controller: Controller | null = null) {
    const entity = new Tank(props);
    this.loopEntities.add(entity);
    this.view.add(entity);
    this.zone.add(entity);
    entity.spawn(props);
    if (controller) {
      controller.on('move', (direction: Direction) => {
        entity.move(direction);
      });
      controller.on('stop', () => {
        entity.stop();
      });
      controller.on('shoot', () => {
        this.createProjectile(entity.shoot());
      });
    }
    return entity;
  }

  createProjectile(projectile: Projectile | null) {
    if (!projectile) {
      return null;
    }
    const loopEntitiesArray = Array.from(this.loopEntities);
    loopEntitiesArray.unshift(projectile);
    this.loopEntities = new Set(loopEntitiesArray);
    this.view.add(projectile);
    this.zone.add(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.update();
  }

  createEntity(props: EntitySettings) {
    let entity: Entity;
    if (props.type === 'flag') {
      entity = new Flag(props);
    } else {
      entity = new Terrain(props);
    }
    this.view.add(entity);
    this.zone.add(entity);
    entity.spawn(props);
    return entity;
  }

  createBoundaries() {
    this.createEntity({
      type: 'boundary',
      width: this.settings.width,
      height: this.settings.boundarySize,
      posX: 0,
      posY: 0,
    });
    this.createEntity({
      type: 'boundary',
      width: this.settings.width,
      height: this.settings.boundarySize,
      posX: 0,
      posY: this.settings.height - this.settings.boundarySize,
    });
    this.createEntity({
      type: 'boundary',
      width: this.settings.boundarySize,
      height: this.settings.height - this.settings.boundarySize * 2,
      posX: 0,
      posY: this.settings.boundarySize,
    });
    this.createEntity({
      type: 'boundary',
      width: this.settings.boundarySize,
      height: this.settings.height - this.settings.boundarySize * 2,
      posX: this.settings.width - this.settings.boundarySize,
      posY: this.settings.boundarySize,
    });
  }

  destroyEntity(entity: Tank | Projectile) {
    this.loopEntities.delete(entity);
  }

  initLoading() {
    const redirectDelay = 500;
    this.mode = 'loading';
    this.overlay.showLoading();

    this.view.offAll('assetsLoaded');
    this.view.on('assetsLoaded', () => {
      setTimeout(() => {
        this.initMenu();
      }, redirectDelay);
    });
  }

  initMenu() {
    this.mode = 'menu';
    this.overlay.showMainMenu(this.mainMenuState);

    this.controllerAll.reset();

    // Обрабатываем переходы по пунктам меню
    this.controllerAll.on('move', (direction: Direction) => {
      if (this.mode !== 'menu') {
        return;
      }
      if (direction === Direction.UP) {
        this.mainMenuState = MainMenuState.SINGLEPLAYER;
      } else if (direction === Direction.DOWN) {
        this.mainMenuState = MainMenuState.MULTIPLAYER;
      }
      this.overlay.updateMainMenuState(this.mainMenuState);
    });

    // Обрабатываем нажатие на указанном пункте меню
    this.controllerAll.on('shoot', () => {
      if (this.mode !== 'menu') {
        return;
      }

      // Открываем экран выбора уровня
      this.initLevelSelector();
    });
  }

  initLevelSelector() {
    this.mode = 'select-level';

    this.overlay.showLevelSelector(this.level);

    this.controllerAll.reset();

    /** Объект setInterval для обработки непрерывного изменения уровня */
    let changeLevelInterval: ReturnType<typeof setInterval>;

    const resetLevelInterval = () => changeLevelInterval && clearInterval(changeLevelInterval);

    this.controllerAll.on('stop', () => {
      if (this.mode == 'select-level') {
        resetLevelInterval();
      }
    });

    this.controllerAll.on('move', (direction: Direction) => {
      if (this.mode !== 'select-level') {
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
          this.overlay.updateLevelSelectorState(this.level);
        }
      }, 100);
    });

    this.controllerAll.on('shoot', () => {
      if (this.mode !== 'select-level') {
        return;
      }

      // Запускаем игру после выбора уровня
      this.initGameLevel();
    });
  }

  initGameOver() {
    const redirectDelay = 3000;
    this.mode = 'loading';
    this.overlay.showGameOver();

    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();

    setTimeout(() => {
      this.initMenu();
    }, redirectDelay);
  }

  initGameLevel() {
    this.mode = 'game';
    this.view.reset();
    this.zone.reset();
    this.controllerAll.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();

    // Анимация перехода выбора уровня в игру
    this.overlay.showStartScreen(this.level);


    // В Scenario
    // new Scenario(this);

    // this.createBoundaries();

    // if (this.mainMenuState === MainMenuState.SINGLEPLAYER) {
    //   this.createTank({ posX: 18, posY: 50, role: 'player', moveSpeed: 4 }, this.controllerAll);
    // } else if (this.mainMenuState === MainMenuState.MULTIPLAYER) {
    //   this.createTank({ posX: 18, posY: 50, role: 'player', moveSpeed: 4 }, this.controllerWasd);
    //   this.createTank({ posX: 34, posY: 50, role: 'player', color: 'lime' }, this.controllerArrows);
    // }

    // const flag = this.createEntity({ type: 'flag', width: 4, height: 4, posX: 26, posY: 50 });
    // this.createEntity({ type: 'brickWall', width: 4, height: 32, posX: 10, posY: 10 });
    // this.createEntity({ type: 'trees', width: 16, height: 8, posX: 30, posY: 18 });
    // this.createEntity({ type: 'water', width: 16, height: 4, posX: 30, posY: 34 });

    // flag.on('damaged', () => {
    //   this.initGameOver();
    // });

    this.controllerAll.on('pause', () => {
      this.togglePause();
    });
  }
}
