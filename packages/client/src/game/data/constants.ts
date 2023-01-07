import { Cell, EntityDynamicSettings, Player, ScreenType } from '../typings';
import {
  GameOverScreen,
  GameScreen,
  LevelSelectorScreen,
  LoadingScreen,
  MainMenuScreen,
  PauseScreen,
  StatisticsScreen,
} from '../ui/screens';
import { classicDesignSprite } from './spriteCoordinates';

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
  [ScreenType.PAUSE]: PauseScreen,
  [ScreenType.GAME_OVER]: GameOverScreen,
  [ScreenType.STATISTICS]: StatisticsScreen,
};

export const playerInitialSettings: Record<Player, EntityDynamicSettings> = {
  [Player.PLAYER1]: { posX: 18, posY: 50, color: 'yellow', variant: 'PLAYER1' },
  [Player.PLAYER2]: { posX: 34, posY: 50, color: 'lime', variant: 'PLAYER2' },
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

//TODO тут будут координаты для спрайта с современным дизайном.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modernDesignSprite = {};

/** Координаты сущностей на sprite-изображении */
export const spriteCoordinates = classicDesignSprite;
