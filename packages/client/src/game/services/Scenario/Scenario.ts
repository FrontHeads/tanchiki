import {
  type Entity,
  type Projectile,
  type Tank,
  Explosion,
  Flag,
  Powerup,
  TankEnemy,
  TankPlayer,
  Terrain,
} from '../../entities';
import { type Direction, type EntitySettings, EntityEvent } from '../../entities/Entity/typings';
import { MainMenuState } from '../../ui/screens/UIScreens/data';
import { EventEmitter } from '../../utils';
import { type Controller, type Game, IndicatorManager, MapManager } from '../';
import { ControllerEvent } from '../Controller/data';
import { spawnPlaces } from '../MapManager/data';
import { type MapTerrainData } from '../MapManager/typings';
import { Player, playerInitialSettings } from './data';
import { type EnemyDestroyedPayload, type ScenarioPlayerState, type ScenarioState, ScenarioEvent } from './typings';

export class Scenario extends EventEmitter<ScenarioEvent> {
  state = {
    enemiesCounter: 0,
    maxEnemies: 20,
    maxActiveEnemies: 4,
    enemiesSpawnDelay: 2000,
    enemies: [],
    powerup: null,
    players: {} as Record<Player, ScenarioPlayerState>,
  } as ScenarioState;

  mapManager!: MapManager;
  map!: MapTerrainData;
  indicatorManager: IndicatorManager;

  constructor(private game: Game) {
    super();
    this.createBoundaries();

    this.mapManager = new MapManager(game.settings);
    this.map = this.mapManager.getMap(game.level);

    /** Индикаторы в боковой панели (сколько осталось танков врагов, сколько жизней, текущий уровень) */
    this.indicatorManager = new IndicatorManager(game);

    if (this.game.mainMenuState === MainMenuState.Singleplayer) {
      this.createPlayerTank(Player.Player1);
    } else if (this.game.mainMenuState === MainMenuState.Multiplayer) {
      this.state.maxActiveEnemies = 6;
      this.createPlayerTank(Player.Player1);
      this.createPlayerTank(Player.Player2);
    }

    /** Размещаем объекты на карте */
    const entities = this.mapManager.mapDataToEntitySettings(this.map);
    entities.forEach(settings => {
      this.createEntity(settings);
    });

    /** Размещаем танки противника */
    this.createTankEnemy();
    this.game.loop.setLoopInterval(
      () => {
        if (this.canCreateTankEnemy()) {
          this.createTankEnemy();
        }
      },
      this.state.enemiesSpawnDelay,
      'SCENARIO_ENEMY_TANK_CREATION'
    );

    /** Инициализируем обработчики событий уровня */
    this.initEventListeners();
  }

  initEventListeners() {
    this
      /** После убийства вражеского танка */
      .on(ScenarioEvent.TankEnemyDestroyed, ({ destination }: EnemyDestroyedPayload) => {
        this.createExplosion(destination);
        if (destination?.flashing) {
          this.createPowerup();
        }

        /** Удаляем его из списка активных */
        this.state.enemies = this.state.enemies.filter(enemy => enemy !== destination);

        /** Триггерим победу в случае если врагов не осталось */
        if (!this.canCreateTankEnemy() && this.state.enemies.length === 0) {
          this.emit(ScenarioEvent.MissionAccomplished);
        }
      })

      /** После убийства игрока */
      .on(ScenarioEvent.TankPlayerDestroyed, (_entity: Tank, playerType: Player) => {
        this.createExplosion(_entity);

        const playerState = this.state.players[playerType];
        --playerState.lives;
        this.indicatorManager.renderPlayerLives(playerType, playerState.lives);

        /** Если не осталось жизней у всех игроков - триггерим game over */
        const isNoLivesLeft = Object.values(this.state.players).every(playerState => playerState.lives < 1);
        if (isNoLivesLeft) {
          this.emit(ScenarioEvent.GameOver);
          return;
        }

        /** Если еще есть жизни - уменьшаем их количество и спауним по-новой */
        if (playerState.lives > 0) {
          this.createPlayerTank(playerType);
        }
      })

      /** Показываем анимацию взрыва при попадании снаряда куда-либо. */
      .on(ScenarioEvent.ProjectileHit, (projectile: Projectile) => {
        this.createExplosion(projectile);
      });
  }

  /** Создание бонуса */
  createPowerup() {
    if (this.state.powerup) {
      this.state.powerup.despawn();
    }
    const powerup = new Powerup();
    this.game.addEntity(powerup);
    const pos = this.mapManager.getRandomEmptyCell();
    powerup.spawn(pos);
    this.state.powerup = powerup;

    powerup.on(EntityEvent.Destroyed, () => {
      if (powerup.variant === 'TANK' && powerup.destroyedBy instanceof TankPlayer) {
        const playerType = powerup.destroyedBy?.variant;
        const playerState = this.state.players[playerType];
        ++playerState.lives;
        this.indicatorManager.renderPlayerLives(playerType as Player, playerState.lives);
      }
    });
  }

  /** Проверяем можно ли еще размещать на поле вражеские танки */
  canCreateTankEnemy() {
    return this.state.enemies.length < this.state.maxActiveEnemies && this.state.enemiesCounter < this.state.maxEnemies;
  }

  /** Создаем элемент карты */
  createEntity(props: EntitySettings) {
    let entity: Entity;
    if (props.type === 'flag') {
      entity = new Flag(props).on(EntityEvent.Destroyed, () => {
        this.emit(ScenarioEvent.GameOver);
      });
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
      width: settings.boundarySize + settings.indicatorsSidebarSize,
      height: settings.height - settings.boundarySize * 2,
      posX: settings.width - settings.boundarySize - settings.indicatorsSidebarSize,
      posY: settings.boundarySize,
    });
  }

  /** Возвращает контроллер в зависимости от режима игры и индекса игрока */
  getGameController(playerType: Player): Controller {
    if (this.game.mainMenuState === MainMenuState.Multiplayer) {
      if (playerType === Player.Player1) {
        return this.game.controllerWasd;
      } else if (playerType === Player.Player2) {
        return this.game.controllerArrows;
      }
    }

    return this.game.controllerAll;
  }

  /** Попытка спаунить танк противника, если есть доступное место */
  trySpawnTankEnemy(entity: TankEnemy) {
    /** Выбираем случайным образом одну из 3 позиций противника */
    const spawnPlaceKey = Math.floor(Math.random() * spawnPlaces[0].length);
    const spawnPlace = this.mapManager.coordsToRect(spawnPlaces[0][spawnPlaceKey], 0);

    if (!entity.spawn(spawnPlace)) {
      this.game.loop.setLoopDelay(this.trySpawnTankEnemy.bind(this, entity), 200);
    }
  }

  /** Создаем вражеский танк */
  createTankEnemy() {
    ++this.state.enemiesCounter;
    const tankEnemiesLeft = this.state.maxEnemies - this.state.enemiesCounter;
    this.indicatorManager.renderTankEnemiesLeft(tankEnemiesLeft);

    const tankEnemySettings = {
      variant: this.mapManager.getMapTankEnemyVariant(this.state.enemiesCounter),
      // Четвёртый, одиннадцатый и восемнадцатый танки появляются переливающимися (за их уничтожение дают бонус)
      flashing: [4, 11, 18].includes(this.state.enemiesCounter),
    };

    const entity = new TankEnemy(tankEnemySettings);

    entity.on(EntityEvent.Spawn, () => {
      entity.on(EntityEvent.Shoot, this.onTankShoot.bind(this)).on(EntityEvent.Destroyed, sourceProjectile => {
        this.emit<[EnemyDestroyedPayload]>(ScenarioEvent.TankEnemyDestroyed, {
          source: sourceProjectile.parent,
          destination: entity,
        });
      });
    });
    this.state.enemies.push(entity);

    this.emit(ScenarioEvent.TankEnemySpawned, entity);
    this.game.addEntity(entity);

    this.trySpawnTankEnemy(entity);
  }

  /** Инициализируем начальное состояние игрока */
  initPlayerState(playerType: Player) {
    this.state.players[playerType] = {
      lives: 2,
      controller: this.getGameController(playerType),
    };

    this.indicatorManager.renderPlayerLives(playerType, this.state.players[playerType].lives);
  }

  /** Создаем танк игрока */
  createPlayerTank(playerType: Player = Player.Player1) {
    /** Создаем стейт игрока при первом размещении на карте */
    if (!(playerType in this.state.players)) {
      this.initPlayerState(playerType);
    }

    const settings = playerInitialSettings[playerType];
    const playerState = this.state.players[playerType];

    const entity = new TankPlayer(settings);
    playerState.entity = entity;
    this.game.addEntity(entity);

    entity
      .on(EntityEvent.Destroyed, () => {
        /** Отлавливаем события убийства игрока и передаем событие Scenario */
        this.emit(ScenarioEvent.TankPlayerDestroyed, entity, playerType);
      })
      .on(EntityEvent.Shoot, this.onTankShoot.bind(this))
      .spawn(settings);

    // Если позиция для спауна танка игрока заблокирована, пробуем ещё раз через некоторое время
    if (!entity.spawned) {
      const respawnRetryInterval = 500;
      entity.setLoopInterval(
        () => {
          entity.spawn(settings);
          if (entity.spawned) {
            entity.clearLoopInterval('RESPAWN_INTERVAL');
          }
        },
        respawnRetryInterval,
        'RESPAWN_INTERVAL'
      );
    }

    this.on(ScenarioEvent.GameOver, () => {
      if (entity && entity.spawned) {
        entity.stop();
      }
    });

    /** Навешиваем события на котроллер, предварительно почистив старые */
    playerState.controller
      .offAll(ControllerEvent.Move)
      .on(ControllerEvent.Move, (direction: Direction) => {
        entity.move(direction);
      })
      .offAll(ControllerEvent.Stop)
      .on(ControllerEvent.Stop, () => {
        entity.stop();
      })
      .offAll(ControllerEvent.Shoot)
      .on(ControllerEvent.Shoot, () => {
        /** Если игра не на паузе, то вызываем выстрел у игрока */
        !this.game.paused && entity.shoot();
      });

    return entity;
  }

  /** Обработчик события выстрела танка */
  onTankShoot(projectile: Projectile) {
    if (!this.game.paused) {
      this.createProjectile(projectile);
    }
  }

  createProjectile(projectile: Projectile | null) {
    if (!projectile) {
      return null;
    }
    this.game.addEntity(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.update();

    projectile.on(EntityEvent.Exploding, () => {
      this.emit(ScenarioEvent.ProjectileHit, projectile);
    });
  }

  createExplosion(entity: Tank | Projectile) {
    const explosion = new Explosion({ parent: entity });
    this.game.addEntity(explosion);
    explosion.spawn();
  }
}
