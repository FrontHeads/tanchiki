import { playerInitialProps } from '../data/constants';
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
import { mapManager } from './MapManager';

export class Scenario extends EventEmitter<ScenarioEvent> {
  state = {} as Record<Player, ScenarioState>;
  map;

  constructor(private game: Game) {
    super();
    this.createBoundaries();
    this.map = mapManager.getMap(game.level);

    if (this.game.mainMenuState === MainMenuState.SINGLEPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerAll);
    } else if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerWasd);
      this.createTank(Player.PLAYER2, this.game.controllerArrows);
    }

    /**
     * TODO: on tankEnemy.exploding - обновляем статистику
     * TODO: если еще остались в запасе вражеские танки - spawn нового
     * TODO: когда враги кончились, мы emit('missionAccomplished')
     */

    const entities = mapManager.mapDataToEntitySettings(this.map);
    entities.forEach(settings => {
      if (settings.type === 'flag') {
        const flag = this.createEntity(settings);
        flag.on('damaged', () => {
          this.emit(ScenarioEvent.GAME_OVER);
        });
      } else {
        this.createEntity(settings);
      }
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

  createTankEnemy(settings: EntityDynamicSettings) {
    console.log(settings);

    // TODO: реализовать создание врагов
  }

  createTank(playerType: Player = Player.PLAYER1, controller: Controller | null = null) {
    const props = playerInitialProps[playerType];
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
      // TODO:  проверяю оставшиеся жизни - spawn нового, либо gameover, если все игроки были убиты
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
