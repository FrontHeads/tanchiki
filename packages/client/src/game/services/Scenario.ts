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
    enemiesLeft: 2,
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
      this.createPlayerTank(Player.PLAYER1);
    } else if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      this.createPlayerTank(Player.PLAYER1);
      this.createPlayerTank(Player.PLAYER2);
    }

    // Временная реализацияя размещения врагов
    while (this.canCreateTankEnemy()) {
      this.createTankEnemy();
    }

    /**
     * TODO: on tankEnemy.exploding - обновляем статистику
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

    this.initEventListeners();
  }

  initEventListeners() {
    this
      /** После убийства вражеского танка */
      .on(ScenarioEvent.TANK_ENEMY_DESTROYED, (entity: TankEnemy) => {
        /** Удаляем его из списка активных */
        this.state.enemies = this.state.enemies.filter(enemy => enemy !== entity);

        /** Спауним новый вражеский танк если необходимо */
        if (this.canCreateTankEnemy()) {
          this.createTankEnemy();
        } else {
          /** Триггерим победу в случае если врагов не осталось */
          if (this.state.enemies.length === 0) {
            this.emit(ScenarioEvent.MISSION_ACCOMPLISHED);
          }
        }
      })

      /** После убийства игрока */
      .on(ScenarioEvent.TANK_PLAYER_DESTROYED, (_entity: Tank, playerType: Player) => {
        // Если не осталось жизней у всех игроков - триггерим game over
        const isNoLivesLeft = Object.entries(this.state.players).every(([_, playerState]) => playerState.lives === 0);
        if (isNoLivesLeft) {
          this.emit(ScenarioEvent.GAME_OVER);
          return;
        }

        const playerState = this.state.players[playerType];

        // Если еще есть жизни - уменьшаем их количество и спауним по-новой
        if (playerState.lives > 0) {
          --playerState.lives;
          this.createPlayerTank(playerType);
        }
      });
  }

  /** Проверяем можно ли еще размещать на поле вражеские танки */
  canCreateTankEnemy() {
    return this.state.enemies.length < this.state.maxActiveEnemies && this.state.enemiesLeft !== 0;
  }

  /** Создаем элемент карты */
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

  /** Создаем рамки вокруг карты */
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

  /** Возвращает контроллер в зависимости от режима игры и индекса игрока */
  getGameController(playerType: Player): Controller {
    if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      if (playerType === Player.PLAYER1) {
        return this.game.controllerWasd;
      } else if (playerType === Player.PLAYER2) {
        return this.game.controllerArrows;
      }
    }

    return this.game.controllerAll;
  }

  /** Создаем вражеский танк */
  createTankEnemy() {
    --this.state.enemiesLeft;

    /** Выбираем случайным образом одну из 3 позиций врага */
    const enemySpawnPlaces = spawnPlaces[0];
    const enemySpawnPlaceK = Math.floor(Math.random() * enemySpawnPlaces.length);

    const posX = this.mapManager.coordToPos(enemySpawnPlaces[enemySpawnPlaceK]);
    const posY = this.mapManager.coordToPos(0);

    const settings = { posX, posY, role: 'enemy', color: 'darkgrey' } as EntityDynamicSettings;
    const entity = new TankEnemy(settings);

    this.state.enemies.push(entity);

    this.emit(ScenarioEvent.TANK_ENEMY_SPAWNED, entity);

    this.game.addEntity(entity);
    entity.spawn(settings);
    entity.on('shoot', (projectile: Projectile) => {
      this.createProjectile(projectile);
    });

    entity.on('destroyed', () => {
      this.emit(ScenarioEvent.TANK_ENEMY_DESTROYED, entity);
    });
  }

  /** Инициализируем начальное состояние игрока */
  initPlayerState(playerType: Player) {
    this.state.players[playerType] = {
      lives: 1,
      stat: {
        [TankEnemyType.ARMOR]: 0,
        [TankEnemyType.BASIC]: 0,
        [TankEnemyType.FAST]: 0,
        [TankEnemyType.POWER]: 0,
      },
      controller: this.getGameController(playerType),
    };
  }

  /** Создаем танк игрока */
  createPlayerTank(playerType: Player = Player.PLAYER1) {
    /** Создаем стейт игрока при первом размещении на карте */
    if (!(playerType in this.state.players)) {
      this.initPlayerState(playerType);
    }

    const settings = playerInitialSettings[playerType];
    const playerState = this.state.players[playerType];

    const entity = new Tank(settings);
    this.game.addEntity(entity);

    entity.spawn(settings);
    entity.on('shoot', (projectile: Projectile) => {
      this.createProjectile(projectile);
    });

    /** Навешиваем события на котроллер, предварительно почистив старые */
    playerState.controller
      .reset()
      .on('move', (direction: Direction) => {
        entity.move(direction);
      })
      .on('stop', () => {
        entity.stop();
      })
      .on('shoot', () => {
        entity.shoot();
      });

    /** Отлавливаем события убийства игрока и передаем событие Scenario */
    entity.on('destroyed', () => {
      this.emit(ScenarioEvent.TANK_PLAYER_DESTROYED, entity, playerType);
    });

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
