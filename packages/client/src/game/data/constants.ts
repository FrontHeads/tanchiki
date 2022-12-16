import { Cell, EntityDynamicSettings, Player, ScreenType } from '../typings';
import { GameOverScreen, GameScreen, LevelSelectorScreen, LoadingScreen, MainMenuScreen } from '../ui/screens';

export const concreteCells: Cell[] = [
  Cell.CONCRETE,
  Cell.CONCRETE_TOP,
  Cell.CONCRETE_RIGHT,
  Cell.CONCRETE_BOTTOM,
  Cell.CONCRETE_LEFT,
  Cell.CONCRETE_LEFT_BOTTOM,
  Cell.CONCRETE_RIGHT_BOTTOM,
];

export const brickCells: Cell[] = [
  Cell.BRICK,
  Cell.BRICK_TOP,
  Cell.BRICK_RIGHT,
  Cell.BRICK_BOTTOM,
  Cell.BRICK_LEFT,
  Cell.BRICK_LEFT_BOTTOM,
  Cell.BRICK_RIGHT_BOTTOM,
];

export const screenClasses = {
  [ScreenType.MAIN_MENU]: MainMenuScreen,
  [ScreenType.LOADING]: LoadingScreen,
  [ScreenType.LEVEL_SELECTOR]: LevelSelectorScreen,
  [ScreenType.GAME]: GameScreen,
  [ScreenType.GAME_OVER]: GameOverScreen,
};

export const playerInitialSettings: Record<Player, EntityDynamicSettings> = {
  [Player.PLAYER1]: { posX: 18, posY: 50, role: 'player' },
  [Player.PLAYER2]: { posX: 34, posY: 50, role: 'player', color: 'lime' },
};

/**
 * Координаты клеток на карте, на которых спаунятся танки
 * Используются при расстановке вражеских танков на поле
 * и при проверке карты уровня на случай, если в эти клетки
 * был установлен какой-то предмет
 */
export const spawnPlaces: Record<number, number[]> = {
  0: [0, 6, 12],
  12: [4, 8],
};

/** Координаты сущностей на sprite-изображении с классическим дизайном */
const classicDesignSprite = {
  playerOneTank: {
    UP: [
      [2, 1, 57, 57],
      [66, 1, 57, 57],
    ],
    RIGHT: [
      [390, 1, 57, 57],
      [458, 1, 57, 57],
    ],
    DOWN: [
      [262, 1, 57, 57],
      [326, 1, 57, 57],
    ],
    LEFT: [
      [134, 1, 57, 57],
      [202, 1, 57, 57],
    ],
  },
  projectile: {
    UP: [
      [1312, 405, 28, 28],
      [1312, 405, 28, 28],
    ],
    RIGHT: [
      [1407, 400, 28, 28],
      [1407, 400, 28, 28],
    ],
    DOWN: [
      [1377, 405, 28, 28],
      [1377, 405, 28, 28],
    ],
    LEFT: [
      [1342, 400, 28, 28],
      [1342, 400, 28, 28],
    ],
  },
  brickWall: [[1052, 1, 63, 63]],
  concreteWall: [[1052, 64, 63, 63]],
  flag: [[1244, 128, 66, 66]],
  trees: [[1117, 128, 63, 63]],
  ice: [[1181, 128, 63, 63]],
  water: [
    [1117, 192, 63, 63],
    [1053, 192, 63, 63],
  ],
};

//TODO тут будут координаты для спрайта с современным дизайном.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modernDesignSprite = {};

/** Координаты сущностей на sprite-изображении */
export const spriteCoordinates = classicDesignSprite;
