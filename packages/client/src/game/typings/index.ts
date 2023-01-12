import { type Color } from '../data/colors';
import { type Entity, type Projectile, type Tank, type TankEnemy } from '../entities';
import { type Controller } from './../services/Controller';

export type Fn = (...args: Array<any>) => void;

export type GameSettings = {
  //gaeme
  width: number;
  height: number;
  boundarySize: number;
  indicatorsSidebarSize: number;
};

export type GameMode = 'Singleplayer' | 'Multiplayer';

export enum GameEvents {
  UpdateLeaderboard = 'UPDATE_LEADERBOARD',
}

export enum Direction { //zone
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type Pos = {
  posX: number;
  posY: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Pos & Size;

export type PosState = { hasCollision: boolean | undefined; nextRect: Rect };

export enum Speed { //entitydynamic
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export enum EntityEvent { //entity
  Move = 'MOVE',
  Stop = 'STOP',
  Slide = 'SLIDE',
  Spawn = 'SPAWN',
  Despawn = 'DESPAWN',
  Ready = 'READY',
  Damaged = 'DAMAGED',
  Destroyed = 'DESTROYED',
  Exploding = 'EXPLODING',
  Shoot = 'SHOOT',

  SetLoopDelay = 'SET_LOOP_DELAY',
  SetLoopInterval = 'SET_LOOP_INTERVAL',
  ClearLoopInterval = 'CLEAR_LOOP_INTERVAL',

  WillHaveNewPos = 'ENTITY_WILL_HAVE_NEW_POS',
  WillDoDamage = 'ENTITY_WILL_DO_DAMAGE',
  ShouldBeDestroyed = 'ENTITY_SHOULD_BE_DESTROYED',
  ShouldUpdate = 'ENTITY_SHOULD_UPDATE',
  DidUpdate = 'ENTITY_DID_UPDATE',
  ShouldRenderText = 'ENTITY_SHOULD_RENDER_TEXT',

  AnimationStarted = 'ANIMATION_STARTED',
  AnimationEnded = 'ANIMATION_ENDED',
}

export type EntityRole = 'player' | 'enemy' | 'neutral';

export type EntityType =
  | 'tank'
  | 'projectile'
  | 'flag'
  | 'boundary'
  | 'brickWall'
  | 'concreteWall'
  | 'trees'
  | 'Water'
  | 'Ice'
  | 'powerup'
  | 'explosion'
  | 'score'
  | 'indicator'
  | 'custom';

export type TerrainVariant = 'WHOLE' | 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT' | 'LEFT_BOTTOM' | 'RIGHT_BOTTOM';

export type PlayerVariant = 'Player1' | 'Player2'; //playertank

export type EnemyVariant = 'Basic' | 'Fast' | 'Power' | 'Armor';

export type ExplosionVariant = 'TANK_EXPLOSION' | 'PROJECTILE_EXPLOSION';

export type ScoreVariant = 100 | 200 | 300 | 400 | 500;

export type EntitySettings = Pos &
  Partial<Size> &
  Partial<{
    direction: Direction;
    type: EntityType;
    //TODO: отрефакторить, чтобы варианты были для конкретных типов
    variant: TerrainVariant | PlayerVariant | EnemyVariant | ExplosionVariant;
    role: EntityRole;
    color: Color | string;
    img: HTMLImageElement;
  }>;

export type EntityDynamicSettings = EntitySettings &
  Partial<{
    moveSpeed: number;
  }>;

export type ProjectileSettings = EntityDynamicSettings & { parent: Tank };

export type DamageSettings = Rect & { source: Projectile }; //zone

export type UIElementSettings = Pos &
  Size &
  Partial<{
    text: string;
    align: CanvasTextAlign;
    color: Color | string;
    backImg: HTMLImageElement | HTMLCanvasElement;
    mainSpriteCoordinates: SpriteCoordinatesNoAnimations;
    indicatorName?: string;
  }>;

export enum MainMenuState { //screen
  Singleplayer,
  Multiplayer,
}

export enum ScreenType {
  Loading = 'LOADING',
  MainMenu = 'MAIN_MENU',
  LevelSelector = 'LEVEL_SELECTOR',
  GameStart = 'GAME_START',
  Pause = 'PAUSE',
  Score = 'SCORE',
  GameOverPopup = 'GAME_OVER_POPUP',
}

// Scenario
//TODO: REFCACTOR???
export enum Player {
  Player1 = 'Player1',
  Player2 = 'Player2',
}

export enum TankEnemyType {
  Basic = 'BASIC',
  Fast = 'FAST',
  Power = 'POWER',
  Armor = 'ARMOR',
}

export enum ScenarioEvent {
  GameOver = 'GAME_OVER',
  MissionAccomplished = 'MISSION_ACCOMPLISHED',

  /** Танк игрока размещен на карте (в момент старта игры и респаун после убийства в случае наличия жизни. */
  TankPlayerSpawned = 'TANK_PLAYER_SPAWNED',
  /** Танк игрока был убит */
  TankPlayerDestroyed = 'TANK_PLAYER_DESTROYED',

  /** Вражеский танк размежен на карте. */
  TankEnemySpawned = 'TANK_ENEMY_SPAWNED',
  /** Вражеский танк был убит. */
  TankEnemyDestroyed = 'TANK_ENEMY_DESTROYED',
  /** Попадание снаряда куда-либо. */
  ProjectileHit = 'PROJECTILE_HIT',
}

export type ScenarioState = {
  /**
   * Максимальное количество активных вражеских танков одновременно на карте
   *
   * При игре в одиночку на карте находится не более четырёх танков противника одновременно;
   * при игре вдвоём их не более шести;
   */
  maxActiveEnemies: number;
  /** Всего танков противника на уровне */
  enemiesLeft: number;
  /** Массив с танами протвников на карте */
  enemies: Tank[];
  /** Объект со state игроков */
  players: Record<Player, ScenarioPlayerState>;
};

export type ScenarioPlayerState = {
  entity?: Tank;
  lives: number;
  controller: Controller;
};

export type EnemyDestroyedPayload = {
  source: Tank;
  destination: TankEnemy;
};

export type MapData = TupleArray<TupleArray<number, 13>, 13>;

export enum Cell { //mapmanager
  Blank = 0,
  Forest = 11,
  Ice = 12,
  Water = 13,
  Base = 15,

  Brick = 1,
  BrickTop = 2,
  BrickRight = 3,
  BrickBottom = 4,
  BrickLeft = 5,
  BrickBottomLeft = 17,
  BrickBottomRight = 18,

  Concrete = 6,
  ConcreteTop = 7,
  ConcreteRight = 8,
  ConcreteBottom = 9,
  ConcreteLeft = 10,
  ConcreteBottomLeft = 19,
  ConcreteBottomRight = 20,
}

export type LoopDelays = Record<number, Array<() => void>>;

export type LoopIntervals = Record<string, LoopInterval>;

export type LoopInterval = {
  loopCounter: number;
  targetLoop: number;
  callback: () => void;
};

export type SpriteCoordinatesNoAnimations = null | number[][]; //view
export type SpriteCoordinatesWithAnimations = Record<string, number[][]>;

export type Animations = AnimationSettings[];

export type AnimationSettings = {
  /** Задержка смены кадров. Чем меньше число - тем быстрее анимация.*/
  delay: number;
  /** Координаты спрайта для конкретной анимации. */
  spriteCoordinates: SpriteCoordinatesWithAnimations | SpriteCoordinatesNoAnimations;
  /** Показывать анимацию бесконечно или однократно. False = однократно. */
  looped: boolean;
  /** Показывать ли основной спрайт сущности во время анимации. */
  showMainSprite?: boolean;
  /** Указывает через какой промежуток времени остановить анимацию. */
  stopTimer?: number;
  /** Имя анимации, оно же имя loopInterval который крутит анимацию. */
  name?: string;
  /** Фрейм (кадр) который будет показан при следующем вызове анимации. */
  spriteFrame?: number;
  /** Время последней отрисовки анимации */
  lastTime?: number;
};

export type CancelAnimation =
  /** Убирает анимацию, но спрайт остается видимым. */
  | 'showEntity'
  /** Убирает анимацию и стирает спрайт. */
  | 'eraseEntity';

/** Список canvas-слоев и прикрепленных к ним сущностей. */
export type LayerList = Record<
  //view
  string,
  {
    context: CanvasRenderingContext2D;
    entities: Set<LayerEntity>;
  }
>;

/** Типизирует сущности привязанные к слою и обязывает хранить все свойства и listeners сущностей */
export type LayerEntity = {
  //view
  instance: Entity;
  listeners: Record<string, (...args: Array<any>) => void>;
};

export type GetSpriteCoordinates = {
  entity: Entity;
  animation?: AnimationSettings;
};

export enum ControllerEvent {
  Stop = 'STOP',
  Move = 'MOVE',
  Shoot = 'SHOOT',
  Pause = 'PAUSE',
  Fullscreen = 'FULLSCREEN',
  Mute = 'MUTE',
  Escape = 'ESCAPE',
}

export type EnemiesKilledState = Record<EnemyVariant, number[]>;
