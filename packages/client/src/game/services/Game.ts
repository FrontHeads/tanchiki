import { Projectile, Tank, Terrain } from '../entities';
import type { Direction, EntityDynamicSettings, EntitySettings, GameSettings } from '../typings';
import { Controller, View, Zone } from './';

export class Game {
  static __instance: Game;
  inited = false;
  paused = false;
  zone!: Zone;
  view!: View;
  controllerWasd!: Controller;
  controllerArrows!: Controller;
  loopProcess: ReturnType<typeof setTimeout> | null = null;
  loopTimeMs = 25;
  loopEntities: Set<Tank | Projectile> = new Set();
  settings: GameSettings = { width: 52, height: 52, root: null };

  private constructor(settings: Pick<GameSettings, 'root'>) {
    this.settings = { ...this.settings, ...settings };
    this.zone = new Zone(this.settings);
    this.view = new View(this.settings);
    this.controllerWasd = new Controller(['wasd']);
    this.controllerArrows = new Controller(['arrows']);
  }

  static create(settings: Pick<GameSettings, 'root'>) {
    if (!Game.__instance) {
      Game.__instance = new Game(settings);
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

  destroyEntity(entity: Tank | Projectile) {
    entity.despawn();
    this.loopEntities.delete(entity);
  }

  init() {
    if (this.inited) {
      return;
    }
    this.inited = true;

    this.startLoop();

    const tank1 = this.createTank({ posX: 4, posY: 4, role: 'player1', moveSpeed: 4 });
    const tank2 = this.createTank({ posX: 12, posY: 12, role: 'player2', color: 'lime' });

    this.createTerrain({ type: 'brickWall', width: 4, height: 32, posX: 20, posY: 16 });
    this.createTerrain({ type: 'trees', width: 16, height: 8, posX: 28, posY: 16 });
    this.createTerrain({ type: 'water', width: 16, height: 4, posX: 28, posY: 32 });

    this.controllerWasd.on('pause', () => {
      this.togglePause();
    });
    this.controllerWasd.on('move', (direction: Direction) => {
      tank1.move(direction);
    });
    this.controllerWasd.on('stop', () => {
      tank1.stop();
    });
    this.controllerWasd.on('shoot', () => {
      if (this.paused) {
        return;
      }
      this.createProjectile(tank1.shoot());
    });
    this.controllerArrows.on('move', (direction: Direction) => {
      tank2.move(direction);
    });
    this.controllerArrows.on('stop', () => {
      tank2.stop();
    });
    this.controllerArrows.on('shoot', () => {
      if (this.paused) {
        return;
      }
      this.createProjectile(tank2.shoot());
    });
  }

  exit() {
    this.stopLoop();
    this.controllerWasd.disable();
    this.controllerArrows.disable();
  }
}
