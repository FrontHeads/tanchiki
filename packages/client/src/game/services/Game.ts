import { Projectile, Tank, Terrain } from '../entities';
import { Direction, EntityDynamicSettings, EntitySettings, GameSettings } from '../typings';
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
  settings: GameSettings = { width: 56, height: 56 };
  mode: 'loading' | 'menu' | 'game' = 'loading';
  mainMenuState = 0;

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

    this.initMenu();
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
      entity.step();
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

  createProjectile(projectile: Projectile) {
    const loopEntitiesArray = Array.from(this.loopEntities);
    loopEntitiesArray.unshift(projectile);
    this.loopEntities = new Set(loopEntitiesArray);
    this.view.add(projectile);
    this.zone.add(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.step();
  }

  createTerrain(props: EntitySettings) {
    const entity = new Terrain(props);
    this.view.add(entity);
    this.zone.add(entity);
    entity.spawn(props);
    return entity;
  }

  createBoundaries() {
    this.createTerrain({
      type: 'boundary',
      width: this.settings.width,
      height: 2,
      posX: 0,
      posY: 0,
    });
    this.createTerrain({
      type: 'boundary',
      width: this.settings.width,
      height: 2,
      posX: 0,
      posY: this.settings.height - 2,
    });
    this.createTerrain({
      type: 'boundary',
      width: 2,
      height: this.settings.height - 4,
      posX: 0,
      posY: 2,
    });
    this.createTerrain({
      type: 'boundary',
      width: 2,
      height: this.settings.height - 4,
      posX: this.settings.width - 2,
      posY: 2,
    });
  }

  destroyEntity(entity: Tank | Projectile) {
    entity.despawn();
    this.loopEntities.delete(entity);
  }

  initMenu() {
    this.overlay.showLoading();
    this.mode = 'loading';

    this.view.offAll('assetsLoaded');
    this.view.on('assetsLoaded', () => {
      setTimeout(() => {
        this.overlay.showMainMenu();
        this.mode = 'menu';
      }, 500);
    });

    this.controllerAll.reset();

    this.controllerAll.on('move', (direction: Direction) => {
      if (this.mode !== 'menu') {
        return;
      }
      if (direction === Direction.UP) {
        this.mainMenuState = 0;
      } else if (direction === Direction.DOWN) {
        this.mainMenuState = 1;
      }
      this.overlay.updateMainMenuState(this.mainMenuState);
    });

    this.controllerAll.on('shoot', () => {
      if (this.mode !== 'menu') {
        return;
      }
      if (this.mainMenuState === 0) {
        this.initScenario();
      }
    });
  }

  initScenario() {
    this.mode = 'game';
    this.view.reset();
    this.zone.reset();
    this.controllerWasd.reset();
    this.controllerArrows.reset();

    this.overlay.showStartScreen('УРОВЕНЬ  1');

    this.createBoundaries();

    const tank1 = this.createTank({ posX: 18, posY: 50, role: 'player1', moveSpeed: 4 }, this.controllerWasd);
    const tank2 = this.createTank({ posX: 34, posY: 50, role: 'player2', color: 'lime' }, this.controllerArrows);

    this.createTerrain({ type: 'brickWall', width: 4, height: 32, posX: 10, posY: 10 });
    this.createTerrain({ type: 'trees', width: 16, height: 8, posX: 30, posY: 18 });
    this.createTerrain({ type: 'water', width: 16, height: 4, posX: 30, posY: 34 });

    this.controllerAll.offAll('pause');
    this.controllerAll.on('pause', () => {
      this.togglePause();
    });
  }
}
