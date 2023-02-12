import {
  type Entity,
  type Projectile,
  type Tank,
  Explosion,
  Flag,
  type PlayerVariant,
  Powerup,
  TankEnemy,
  TankPlayer,
  Terrain,
} from '../../entities';
import { type Direction, type EntitySettings, EntityEvent } from '../../entities/Entity/typings';
import { EventEmitter } from '../../utils';
import { type Controller, type Game, IndicatorManager, MapManager } from '../';
import { ControllerEvent } from '../Controller/data';
import { Cell, spawnPlaces } from '../MapManager/data';
import { Player, playerInitialSettings } from './data';
import { ScenarioEvent } from './typings';

export { ScenarioEvent };

export class Scenario extends EventEmitter<ScenarioEvent> {
  mapManager: MapManager;
  /** Индикаторы в боковой панели (сколько осталось танков врагов, сколько жизней, текущий уровень) */
  indicatorManager: IndicatorManager;

  activeEnemies: TankEnemy[] = [];
  activePowerup: Powerup | null = null;
  maxTotalEnemies = 20;
  maxActiveEnemies = 4;
  enemiesSpawnDelay = 1000;
  enemiesSpawnCounter = 0;

  constructor(private game: Game) {
    super();
    this.mapManager = new MapManager(game);
    this.indicatorManager = new IndicatorManager(game);

    this.createTerrain();
    this.createEnemies();
    this.createPlayers();
  }

  createTerrain() {
    this.createBoundaries();
    /** Размещаем объекты на карте */
    const map = this.mapManager.getMap();
    const entities = this.mapManager.mapDataToEntitySettings(map);
    entities.forEach(settings => {
      this.createEntity(settings);
    });
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
  }

  /** Создаем рамки вокруг карты */
  createBoundaries() {
    const settings = this.game.state;
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

  /** Размещает танки противника */
  createEnemies() {
    if (this.game.state.mode === 'SINGLEPLAYER') {
      this.maxTotalEnemies = this.game.state.singleplayerMaxTotalEnemies;
      this.maxActiveEnemies = this.game.state.singleplayerMaxActiveEnemies;
      this.enemiesSpawnDelay = this.game.state.singleplayerEnemiesSpawnDelay;
    } else if (this.game.state.mode === 'MULTIPLAYER') {
      this.maxTotalEnemies = this.game.state.multiplayerMaxTotalEnemies;
      this.maxActiveEnemies = this.game.state.multiplayerMaxActiveEnemies;
      this.enemiesSpawnDelay = this.game.state.multiplayerEnemiesSpawnDelay;
    }

    this.createTankEnemy();
    this.game.loop.setLoopInterval(
      () => {
        if (this.canCreateTankEnemy()) {
          this.createTankEnemy();
        }
      },
      this.enemiesSpawnDelay,
      'SCENARIO_ENEMY_TANK_CREATION'
    );
  }

  /** Проверяем можно ли еще размещать на поле вражеские танки */
  canCreateTankEnemy() {
    return this.activeEnemies.length < this.maxActiveEnemies && this.enemiesSpawnCounter < this.maxTotalEnemies;
  }

  /** Создаем вражеский танк */
  createTankEnemy() {
    ++this.enemiesSpawnCounter;
    const tankEnemiesLeft = this.maxTotalEnemies - this.enemiesSpawnCounter;
    this.indicatorManager.renderTankEnemiesLeft(tankEnemiesLeft);

    const tankEnemySettings = {
      variant: this.mapManager.getMapTankEnemyVariant(this.enemiesSpawnCounter),
      // Четвёртый, одиннадцатый и восемнадцатый танки появляются переливающимися (за их уничтожение дают бонус)
      flashing: this.game.state.flashingEnemyTanksWithPowerups.includes(this.enemiesSpawnCounter),
    };

    // Убираем с карты предыдущий бонус, если появился новый бонусный танк
    if (tankEnemySettings.flashing && this.activePowerup) {
      this.activePowerup.despawn();
    }

    const entity = new TankEnemy(tankEnemySettings);
    this.game.addEntity(entity);
    this.activeEnemies.push(entity);

    entity
      .on(EntityEvent.Shoot, projectile => {
        this.createProjectile(projectile);
      })
      .on(EntityEvent.Destroyed, () => {
        this.createExplosion(entity);

        // Если уничтожен мигающий танк, размещаем на карте бонус
        if (entity.flashing) {
          this.createPowerup();
        }

        // Удаляем уничтоженный танк из списка активных
        this.activeEnemies = this.activeEnemies.filter(enemy => enemy !== entity);

        // Триггерим победу в случае если врагов не осталось
        if (!this.canCreateTankEnemy() && this.activeEnemies.length === 0) {
          this.emit(ScenarioEvent.MissionAccomplished);
        }
      });

    this.trySpawnTankEnemy(entity);
  }

  /** Попытка спаунить танк противника, если есть доступное место. */
  trySpawnTankEnemy(entity: TankEnemy) {
    /** Выбираем случайным образом одну из 3 позиций противника. */
    const spawnPlaceKey = Math.floor(Math.random() * spawnPlaces[0].length);
    const spawnPlace = this.mapManager.coordsToRect(spawnPlaces[0][spawnPlaceKey], 0);

    if (!entity.spawn(spawnPlace)) {
      this.game.loop.setLoopDelay(this.trySpawnTankEnemy.bind(this, entity), this.game.state.tankRespawnRetryInterval);
    }
  }

  /** Размещает танки игроков. */
  createPlayers() {
    if (this.game.state.mode === 'SINGLEPLAYER') {
      this.createPlayerTank(Player.Player1);
    } else if (this.game.state.mode === 'MULTIPLAYER') {
      this.createPlayerTank(Player.Player1);
      this.createPlayerTank(Player.Player2);
    }
  }

  /** Создаем танк игрока */
  createPlayerTank(playerType: Player = Player.Player1) {
    const settings = playerInitialSettings[playerType];

    const playerState = this.getPlayerState(playerType);
    settings.upgradeTier = playerState.upgradeTier;

    const entity = new TankPlayer(settings);
    this.game.addEntity(entity);

    entity
      .on(EntityEvent.Spawn, () => {
        this.indicatorManager.renderPlayerLives(playerType, playerState.lives);
      })
      .on(EntityEvent.Shoot, projectile => {
        this.createProjectile(projectile);
      })
      .on(EntityEvent.Destroyed, () => {
        this.createExplosion(entity);

        playerState.upgradeTier = 1;
        --playerState.lives;
        this.indicatorManager.renderPlayerLives(playerType, playerState.lives);

        const playerOneIsOut = this.game.state.playerOne.lives <= 0;
        const playerTwoIsOut = this.game.state.mode === 'SINGLEPLAYER' || this.game.state.playerTwo.lives <= 0;

        if (playerOneIsOut && playerTwoIsOut) {
          this.emit(ScenarioEvent.GameOver);
        }

        if (playerState.lives > 0) {
          this.createPlayerTank(playerType);
        }
      });

    this.trySpawnTankPlayer(entity);

    // Если флаг уничтожен, останавливаем танки игроков
    this.on(ScenarioEvent.GameOver, () => {
      if (entity && entity.spawned) {
        entity.stop();
      }
    });

    const controller = this.getPlayerController(playerType);
    /** Навешиваем события на котроллер, предварительно почистив старые. */
    controller
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
        /** Если игра не на паузе, то вызываем выстрел у игрока. */
        !this.game.state.paused && entity.shoot();
      });
  }

  /** Попытка спаунить танк игрока. */
  trySpawnTankPlayer(entity: TankPlayer) {
    entity.spawn();
    // Если позиция для спауна танка игрока заблокирована, пробуем ещё раз через некоторое время
    if (!entity.spawned) {
      this.game.loop.setLoopDelay(this.trySpawnTankPlayer.bind(this, entity), this.game.state.tankRespawnRetryInterval);
    }
  }

  getPlayerState(playerType: Player | PlayerVariant) {
    return playerType === Player.Player1 ? this.game.state.playerOne : this.game.state.playerTwo;
  }

  /** Возвращает контроллер в зависимости от режима игры и индекса игрока. */
  getPlayerController(playerType: Player): Controller {
    if (this.game.state.mode === 'MULTIPLAYER') {
      if (playerType === Player.Player1) {
        return this.game.controllerWasd;
      } else if (playerType === Player.Player2) {
        return this.game.controllerArrows;
      }
    }

    return this.game.controllerAll;
  }

  createProjectile(projectile: Projectile | null) {
    if (!projectile) {
      return null;
    }
    this.game.addEntity(projectile);
    projectile.spawn({ posX: projectile.posX, posY: projectile.posY });
    projectile.update();

    projectile.on(EntityEvent.Exploding, () => {
      /** Показываем анимацию взрыва при попадании снаряда куда-либо. */
      this.createExplosion(projectile);
    });
  }

  createExplosion(entity: Tank | Projectile) {
    const explosion = new Explosion({ parent: entity });
    this.game.addEntity(explosion);
    explosion.spawn();
  }

  /** Создание бонуса */
  createPowerup() {
    if (this.activePowerup) {
      this.activePowerup.despawn();
    }
    const powerup = new Powerup();
    this.game.addEntity(powerup);
    const pos = this.mapManager.getRandomEmptyCell();
    powerup.spawn(pos);
    this.activePowerup = powerup;

    powerup.on(EntityEvent.Destroyed, () => {
      const playerTank = powerup.destroyedBy;
      if (!(playerTank instanceof TankPlayer)) {
        return;
      }
      const playerType = playerTank.variant;
      const playerState = this.getPlayerState(playerType);

      // Бонус, прибавляющий силу атаки у игрока
      if (powerup.variant === 'STAR') {
        ++playerState.upgradeTier;
        playerTank.upgrade();
      }

      // Бонус, дающий игроку защитное поле на 10 секунд
      if (powerup.variant === 'HELMET') {
        playerTank.useShield(this.game.state.shieldPowerupDuration);
      }

      // Бонус, дающий дополнительную жизнь
      if (powerup.variant === 'TANK') {
        ++playerState.lives;
        this.indicatorManager.renderPlayerLives(playerType as Player, playerState.lives);
      }

      // Бонус, взрывающий все вражеские танки
      if (powerup.variant === 'GRENADE') {
        this.activeEnemies.forEach(enemyTank => {
          enemyTank.beDestroyed(playerTank);
        });
      }

      // Бонус, замораживающий врагов на 10 секунд
      if (powerup.variant === 'CLOCK') {
        const freezeIntervalName = 'ENEMY_FREEZE_INTERVAL';
        // Делаем заморозку через каждые 100 мс, чтобы работало и для врагов, которые отспавнились позже
        let freezeTicksLeft = 100;
        const freezeSubDuration = Math.round(this.game.state.freezePowerupDuration / freezeTicksLeft);

        const setAllEnemiesFrozen = (frozen: boolean) => {
          this.activeEnemies.forEach(enemyTank => {
            enemyTank.frozen = frozen;
          });
        };

        this.game.loop.clearLoopInterval(freezeIntervalName);
        setAllEnemiesFrozen(true);
        this.game.loop.setLoopInterval(
          () => {
            setAllEnemiesFrozen(true);
            if (--freezeTicksLeft <= 0) {
              this.game.loop.clearLoopInterval(freezeIntervalName);
              setAllEnemiesFrozen(false);
            }
          },
          freezeSubDuration,
          freezeIntervalName
        );
      }

      // Бонус, укрепляющий стены вокруг базы на 10 секунд
      if (powerup.variant === 'SHOVEL') {
        const wallCells = [
          ['BottomRight', 11, 5],
          ['Bottom', 11, 6],
          ['BottomLeft', 11, 7],
          ['Right', 12, 5],
          ['Left', 12, 7],
        ];

        const constructWalls = (wallMaterial: 'Brick' | 'Concrete') => {
          for (const [cellVariant, y, x] of wallCells) {
            const cell = Cell[(wallMaterial + cellVariant) as keyof typeof Cell];
            const settings = this.mapManager.cellToEntitySettings(cell, x as number, y as number);
            if (!settings) {
              continue;
            }
            // Расчищаем место, где должны стать новые стены
            this.game.zone.doAreaDamage(settings, powerup);
            this.createEntity(settings);
          }
        };

        // Ставим бетонные стены
        constructWalls('Concrete');

        const mainIntervalName = 'REINFORCED_WALLS_INTERVAL_MAIN';
        const mainIntervalDuration = this.game.state.wallsPowerupDuration;
        const finishingIntervalName = 'REINFORCED_WALLS_INTERVAL_FINISHING';
        const finishingIntervalDuration = 200;
        let finishingIntervalCountdown = 10;

        // Очищаем интервалы на случай подбора такого же бонуса до окончания текущего
        this.game.loop.clearLoopInterval(mainIntervalName);
        this.game.loop.clearLoopInterval(finishingIntervalName);
        this.game.loop.setLoopInterval(
          () => {
            // Через 10 секунд действие бонуса заканчивается
            this.game.loop.clearLoopInterval(mainIntervalName);
            this.game.loop.setLoopInterval(
              () => {
                // Делаем, чтобы по истечению действия бонуса стены мигали
                const shouldPlaceConcreteWalls = --finishingIntervalCountdown % 2 === 0;
                if (finishingIntervalCountdown <= 0) {
                  this.game.loop.clearLoopInterval(finishingIntervalName);
                } else if (shouldPlaceConcreteWalls) {
                  constructWalls('Concrete');
                } else {
                  constructWalls('Brick');
                }
              },
              finishingIntervalDuration,
              finishingIntervalName
            );
          },
          mainIntervalDuration,
          mainIntervalName
        );
      }
    });
  }
}
