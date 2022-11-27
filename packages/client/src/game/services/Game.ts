import { Entity, Projectile, Tank, Terrain } from '../entities';
import type { DirectionT } from '../typings';
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
  settings = { width: 52, height: 52 };

  constructor(root: HTMLElement | null) {
    if (Game.__instance) {
      return Game.__instance;
    }
    Game.__instance = this;

    this.zone = new Zone(this.settings);
    this.view = new View(this.settings, root);
    this.controllerWasd = new Controller(['wasd']);
    this.controllerArrows = new Controller(['arrows']);
  }

  loop() {
    const cycleStartTime = performance.now();
    let nextCycleDelay = this.loopTimeMs;
    for (const entity of this.loopEntities) {
      entity.act();
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
    }
  }

  createTank(props: Pick<Entity, 'posX' | 'posY'> & Partial<Tank>) {
    const entity = new Tank(props);
    this.loopEntities.add(entity);
    this.view.bindEntityToLayer(entity, 'tanks');
    this.zone.registerEntity(entity);
    entity.spawn(props);
    return entity;
  }

  createProjectile(projectile: Projectile) {
    this.loopEntities.add(projectile);
    this.view.bindEntityToLayer(projectile, 'projectiles');
    this.zone.registerEntity(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
  }

  createTerrain(props: Pick<Entity, 'type' | 'width' | 'height' | 'posX' | 'posY'>) {
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
    this.controllerWasd.on('move', (direction: DirectionT) => {
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
    this.controllerArrows.on('move', (direction: DirectionT) => {
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
}
