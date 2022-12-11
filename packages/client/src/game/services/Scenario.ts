import { playerInitialSettings, spawnPlaces } from '../data/constants';
import { Entity, Flag, Projectile, Tank, Terrain } from '../entities';
import { TankEnemy } from '../entities/TankEnemy';
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
import { MapData, ScenarioPlayerState } from './../typings/index';
import { Controller } from './Controller';
import { Game } from './Game';
import { MapManager } from './MapManager';

export class Scenario extends EventEmitter<ScenarioEvent> {
  state = {
    enemiesLeft: 20,
    maxActiveEnemies: 3,
    enemies: [],
    players: {} as Record<Player, ScenarioPlayerState>,
  } as ScenarioState;

  mapManager!: MapManager;
  map!: MapData;

  constructor(private game: Game) {
    super();
    this.createBoundaries();

    this.mapManager = new MapManager(game.settings);
    this.map = this.mapManager.getMap(game.level);

    if (this.game.mainMenuState === MainMenuState.SINGLEPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerAll);
    } else if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      this.createTank(Player.PLAYER1, this.game.controllerWasd);
      this.createTank(Player.PLAYER2, this.game.controllerArrows);
    }

    // Временная реализацияя размещения врагов
    while (this.ifCanCreateTankEnemy()) {
      this.createTankEnemy();
    }

    /**
     * TODO: on tankEnemy.exploding - обновляем статистику
     * TODO: Eсли еще остались в запасе вражеские танки - spawn нового
     */

    const entities = this.mapManager.mapDataToEntitySettings(this.map);
    entities.forEach(settings => {
      if (settings.type === 'flag') {
        this.createEntity(settings).on('damaged', () => {
          this.emit(ScenarioEvent.GAME_OVER);
        });
      } else {
        this.createEntity(settings);
      }
    });
  }

  /** Проверяем можно ли еще размещать на поле вражеские танки */
  ifCanCreateTankEnemy() {
    return this.state.enemies.length < this.state.maxActiveEnemies && this.state.enemiesLeft !== 0;
  }

  createEntity(props: EntitySettings) {
    let entity: Entity;
    if (props.type === 'flag') {
      entity = new Flag(props);
    } else {
      entity = new Terrain(props);
    }
    this.game.addEntity(entity);
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

  createTankEnemy() {
    this.state.enemiesLeft--;
    const enemySpawnPlaces = spawnPlaces[0];
    const enemySpawnPlaceK = Math.floor(Math.random() * enemySpawnPlaces.length);

    const posX = this.mapManager.coordToPos(enemySpawnPlaces[enemySpawnPlaceK]);
    const posY = this.mapManager.coordToPos(0);

    const color = 'darkgrey';

    const settings = { posX, posY, role: 'enemy', color } as EntityDynamicSettings;

    const entity = new TankEnemy(settings);
    this.state.enemies.push(entity);

    this.game.addEntity(entity);
    entity.spawn(settings);
    entity.on('shoot', (projectile: Projectile) => {
      this.createProjectile(projectile);
    });

    entity.on('entityShouldBeDestroyed', () => {
      this.state.enemies = this.state.enemies.filter(enemy => enemy !== entity);
      if (this.ifCanCreateTankEnemy()) {
        this.createTankEnemy();
      }
      // Если врагов не осталось - триггерим победу
      if (this.state.enemiesLeft === 0) {
        this.emit(ScenarioEvent.MISSION_ACCOMPLISHED);
      }
    });
  }

  createTank(playerType: Player = Player.PLAYER1, controller: Controller | null = null) {
    const settings = playerInitialSettings[playerType];
    const entity = new Tank(settings);

    this.state.players[playerType] = {
      lives: 5,
      stat: {
        [TankEnemyType.ARMOR]: 0,
        [TankEnemyType.BASIC]: 0,
        [TankEnemyType.FAST]: 0,
        [TankEnemyType.POWER]: 0,
      },
      entity,
    };

    entity.on('entityShouldBeDestroyed', () => {
      // TODO:  проверяю оставшиеся жизни - spawn нового, либо gameover, если все игроки были убиты
    });

    this.game.addEntity(entity);
    entity.spawn(settings);
    entity.on('shoot', (projectile: Projectile) => {
      this.createProjectile(projectile);
    });
  
    if (controller) {
      controller.on('move', (direction: Direction) => {
        entity.move(direction);
      });
      controller.on('stop', () => {
        entity.stop();
      });
      controller.on('shoot', () => {
        entity.shoot();
      });
    }
    return entity;
  }

  createProjectile(projectile: Projectile | null) {
    if (!projectile) {
      return null;
    }
    this.game.addEntity(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.update();
  }
}
