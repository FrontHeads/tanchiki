import { playerInitialSettings, spawnPlaces } from '../data/constants';
import { Entity, Explosion, Flag, Projectile, Tank, TankEnemy, Terrain } from '../entities';
import {
  Direction,
  EnemyDestroyedPayload,
  EntityDynamicSettings,
  EntitySettings,
  MainMenuState,
  MapData,
  Player,
  ScenarioEvent,
  ScenarioPlayerState,
  ScenarioState,
  TankEnemyType,
} from '../typings';
import { EventEmitter } from '../utils';
import { Controller } from './Controller';
import { Game } from './Game';
import { MapManager } from './MapManager';

export class Scenario extends EventEmitter<ScenarioEvent> {
  state = {
    enemiesLeft: 20,
    maxActiveEnemies: 4,
    enemies: [],
    players: {} as Record<Player, ScenarioPlayerState>,
  } as ScenarioState;

  mapManager!: MapManager;
  map!: MapData;

  constructor(private game: Game) {
    /**
     * TODO: Доработать после реализации бонусных танков
     * Четвёртый, одиннадцатый и восемнадцатый танки, независимо от типа, появляются переливающиеся цветами
     **/
    super();
    this.createBoundaries();

    this.mapManager = new MapManager(game.settings);
    this.map = this.mapManager.getMap(game.level);

    if (this.game.mainMenuState === MainMenuState.SINGLEPLAYER) {
      this.createPlayerTank(Player.PLAYER1);
    } else if (this.game.mainMenuState === MainMenuState.MULTIPLAYER) {
      this.state.maxActiveEnemies = 6;
      this.createPlayerTank(Player.PLAYER1);
      this.createPlayerTank(Player.PLAYER2);
    }

    /** Размещаем объекты на карте */
    const entities = this.mapManager.mapDataToEntitySettings(this.map);
    entities.forEach(settings => {
      this.createEntity(settings);
    });

    /** Размещаем танки противника */
    while (this.canCreateTankEnemy()) {
      this.createTankEnemy();
    }

    /** Инициализируем обработчики событий уровня */
    this.initEventListeners();
  }

  initEventListeners() {
    this
      /** После убийства вражеского танка */
      .on(ScenarioEvent.TANK_ENEMY_DESTROYED, ({ source, destination }: EnemyDestroyedPayload) => {
        this.createExplosion(destination);

        /** Удаляем его из списка активных */
        this.state.enemies = this.state.enemies.filter(enemy => enemy !== destination);

        /** Ищем кто убил TankEnemy для обновления статистики */
        // TODO: доделать после того как в source будет приходить Tank entity
        const playerState = Object.values(this.state.players).find(({ entity }) => entity === source);

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
        this.createExplosion(_entity);

        const playerState = this.state.players[playerType];
        --playerState.lives;

        /** Если не осталось жизней у всех игроков - триггерим game over */
        const isNoLivesLeft = Object.values(this.state.players).every(playerState => playerState.lives < 1);
        if (isNoLivesLeft) {
          this.emit(ScenarioEvent.GAME_OVER);
          return;
        }

        /** Если еще есть жизни - уменьшаем их количество и спауним по-новой */
        if (playerState.lives > 0) {
          this.createPlayerTank(playerType);
        }
      })

      /** Показываем анимацию взрыва при попадании снаряда куда-либо. */
      .on(ScenarioEvent.PROJECTILE_HIT, (projectile: Projectile) => {
        this.createExplosion(projectile);
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
      entity = new Flag(props).on('damaged', () => {
        this.emit(ScenarioEvent.GAME_OVER);
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

  /** Попытка спаунить танк противника, если есть доступное место */
  trySpawnTankEnemy(entity: TankEnemy) {
    /** Выбираем случайным образом одну из 3 позиций противника */
    const spawnPlaceKey = Math.floor(Math.random() * spawnPlaces[0].length);
    const spawnPlace = this.mapManager.coordsToRect(spawnPlaces[0][spawnPlaceKey], 0);

    if (!entity.spawn(spawnPlace)) {
      this.game.setLoopDelay(this.trySpawnTankEnemy.bind(this, entity), 200);
    }
  }

  /** Создаем вражеский танк */
  createTankEnemy() {
    --this.state.enemiesLeft;

    const entity = new TankEnemy({ role: 'enemy', color: '#483D8B' } as EntityDynamicSettings);
    entity.on('spawn', () => {
      entity.on('shoot', this.onTankShoot.bind(this)).on('destroyed', sourceEntity => {
        this.emit<[EnemyDestroyedPayload]>(ScenarioEvent.TANK_ENEMY_DESTROYED, {
          source: sourceEntity,
          destination: entity,
        });
      });
    });
    this.state.enemies.push(entity);

    this.emit(ScenarioEvent.TANK_ENEMY_SPAWNED, entity);
    this.game.addEntity(entity);

    this.trySpawnTankEnemy(entity);
  }

  /** Инициализируем начальное состояние игрока */
  initPlayerState(playerType: Player) {
    this.state.players[playerType] = {
      lives: 2,
      statistics: {
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
    playerState.entity = entity;

    this.game.addEntity(entity);

    entity.spawn(settings);
    entity.on('shoot', this.onTankShoot.bind(this));

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

    projectile.on('exploding', () => {
      this.emit(ScenarioEvent.PROJECTILE_HIT, projectile);
    });
  }

  createExplosion(entity: Tank | Projectile) {
    const explosion = new Explosion({ explosionParentEntity: entity });
    this.game.addEntity(explosion);
    explosion.spawn({ posX: explosion.posX, posY: explosion.posY });
  }
}
