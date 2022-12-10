import { Entity, Flag, Projectile, Tank, Terrain } from '../entities';
import {
  Direction,
  EntityDynamicSettings,
  EntitySettings,
  MainMenuState,
  Player,
  ScenarioEvent,
  ScenarioState,
  TankEnemyType,
} from '../typings';
import { EventEmitter } from '../utils';
import { Controller } from './Controller';
import { Game } from './Game';

export const PLAYER_INITIAL_PROPS: Record<Player, EntityDynamicSettings> = {
  [Player.PLAYER1]: { posX: 18, posY: 50, role: 'player', moveSpeed: 4 },
  [Player.PLAYER2]: { posX: 34, posY: 50, role: 'player', color: 'lime' },
};

export class Scenario extends EventEmitter<ScenarioEvent> {
  state = {} as Record<Player, ScenarioState>;

  constructor(private game: Game) {
    super();
    this.createBoundaries();

    if (this.game.mainMenuState === MainMenuState.SINGLEPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerAll);
    } else if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerWasd);
      this.createTank(Player.PLAYER2, this.game.controllerArrows);
    }

    // on Entity.exploding - обновляем статистику
    // if еще остались в запасе таки - spawn нового врага
    // когда враги кончились, мы emit('missionAccomplished')

    const flag = this.createEntity({ type: 'flag', width: 4, height: 4, posX: 26, posY: 50 });

    // Разместить из шаблона
    // this.createEntity({ type: 'brickWall', subtype: Cell.brickRight, width: 4, height: 32, posX: 10, posY: 10 });
    this.createEntity({ type: 'brickWall', width: 4, height: 32, posX: 10, posY: 10 });
    this.createEntity({ type: 'trees', width: 16, height: 8, posX: 30, posY: 18 });
    this.createEntity({ type: 'water', width: 16, height: 4, posX: 30, posY: 34 });

    flag.on('damaged', () => {
      this.emit(ScenarioEvent.GAME_OVER);
    });
  }

  createEntity(props: EntitySettings) {
    let entity: Entity;
    if (props.type === 'flag') {
      entity = new Flag(props);
    } else {
      entity = new Terrain(props);
    }
    this.game.view.add(entity);
    this.game.zone.add(entity);
    entity.spawn(props);
    return entity;
  }

  createBoundaries() {
    const { settings } = this.game;
    this.createEntity({
      type: 'boundary',
      width: settings.width,
      height: settings.boundarySize,
      posX: 0,
      posY: 0,
    });
    this.createEntity({
      type: 'boundary',
      width: settings.width,
      height: settings.boundarySize,
      posX: 0,
      posY: settings.height - settings.boundarySize,
    });
    this.createEntity({
      type: 'boundary',
      width: settings.boundarySize,
      height: settings.height - settings.boundarySize * 2,
      posX: 0,
      posY: settings.boundarySize,
    });
    this.createEntity({
      type: 'boundary',
      width: settings.boundarySize,
      height: settings.height - settings.boundarySize * 2,
      posX: settings.width - settings.boundarySize,
      posY: settings.boundarySize,
    });
  }

  //   createTankEnemy(props: EntityDynamicSettings) {
  //     return null;
  //   }

  createTank(playerType: Player = Player.PLAYER1, controller: Controller | null = null) {
    const props = PLAYER_INITIAL_PROPS[playerType];
    const entity = new Tank(props);

    this.state[playerType] = {
      lives: 5,
      stat: {
        [TankEnemyType.ARMOR]: 0,
        [TankEnemyType.BASIC]: 0,
        [TankEnemyType.FAST]: 0,
        [TankEnemyType.POWER]: 0,
      },
      entity,
    };

    entity.on('shouldBeDestroyed', () => {
      // проверяю оставшиеся жизни
    });

    this.game.loopEntities.add(entity);
    this.game.view.add(entity);
    this.game.zone.add(entity);
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
    const loopEntitiesArray = Array.from(this.game.loopEntities);
    loopEntitiesArray.unshift(projectile);
    this.game.loopEntities = new Set(loopEntitiesArray);
    this.game.view.add(projectile);
    this.game.zone.add(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.update();
  }
}
