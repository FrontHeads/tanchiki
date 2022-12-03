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
  mode: 'menu' | 'game' = 'menu';
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

  togglePause() {
    if (!this.inited) {
      return;
    }
    if (this.paused) {
      this.startLoop();
    } else {
      this.stopLoop();
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

  createTank(props: EntityDynamicSettings) {
    const entity = new Tank(props);
    this.loopEntities.add(entity);
    this.view.bindEntityToLayer(entity, 'tanks');
    this.zone.registerEntity(entity);
    entity.spawn(props);
    return entity;
  }

  createProjectile(projectile: Projectile) {
    const loopEntitiesArray = Array.from(this.loopEntities);
    loopEntitiesArray.unshift(projectile);
    this.loopEntities = new Set(loopEntitiesArray);
    this.view.bindEntityToLayer(projectile, 'projectiles');
    this.zone.registerEntity(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.step();
  }

  createTerrain(props: EntitySettings) {
    const entity = new Terrain(props);
    if (props.type === 'trees') {
      this.view.bindEntityToLayer(entity, 'ceiling');
    } else {
      this.view.bindEntityToLayer(entity, 'floor');
    }
    this.zone.registerEntity(entity);
    entity.spawn(props);
    return entity;
  }

  createBoundaries() {
    this.createTerrain({ type: 'boundary', width: this.settings.width, height: 2, posX: 0, posY: 0 });
    this.createTerrain({
      type: 'boundary',
      width: this.settings.width,
      height: 2,
      posX: 0,
      posY: this.settings.height - 2,
    });
    this.createTerrain({ type: 'boundary', width: 2, height: this.settings.height - 4, posX: 0, posY: 2 });
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

  createView(root: HTMLElement | null) {
    this.view.build(root);
  }

  init(root: HTMLElement | null) {
    this.createView(root);

    if (this.inited) {
      return;
    }
    this.inited = true;

    this.overlay.showMainMenu();
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
        this.mode = 'game';
        this.overlay.showStartScreen('УРОВЕНЬ  1');
      }
    });

    this.startLoop();

    this.createBoundaries();

    const tank1 = this.createTank({ posX: 18, posY: 50, role: 'player1', moveSpeed: 4 });
    const tank2 = this.createTank({ posX: 34, posY: 50, role: 'player2', color: 'lime' });

    this.createTerrain({ type: 'brickWall', width: 4, height: 32, posX: 10, posY: 10 });
    this.createTerrain({ type: 'trees', width: 16, height: 8, posX: 30, posY: 18 });
    this.createTerrain({ type: 'water', width: 16, height: 4, posX: 30, posY: 34 });

    this.controllerAll.on('pause', () => {
      this.togglePause();
    });
    this.controllerWasd.on('move', (direction: Direction) => {
      if (this.mode !== 'game') {
        return;
      }
      tank1.move(direction);
    });
    this.controllerWasd.on('stop', () => {
      tank1.stop();
    });
    this.controllerWasd.on('shoot', () => {
      if (this.mode !== 'game' || this.paused) {
        return;
      }
      this.createProjectile(tank1.shoot());
    });
    this.controllerArrows.on('move', (direction: Direction) => {
      if (this.mode !== 'game') {
        return;
      }
      tank2.move(direction);
    });
    this.controllerArrows.on('stop', () => {
      tank2.stop();
    });
    this.controllerArrows.on('shoot', () => {
      if (this.mode !== 'game' || this.paused) {
        return;
      }
      this.createProjectile(tank2.shoot());
    });
  }

  exit() {
    this.stopLoop();
    this.controllerWasd.disable();
    this.controllerArrows.disable();
    this.inited = false;
  }
}
