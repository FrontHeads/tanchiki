import { Cell, ScreenType } from '../typings';
import { GameOverScreen, GameScreen, LevelSelectorScreen, LoadingScreen, MainMenuScreen } from '../ui/screens';

export const ConcreteCells: Cell[] = [
  Cell.CONCRETE,
  Cell.CONCRETE_TOP,
  Cell.CONCRETE_RIGHT,
  Cell.CONCRETE_BOTTOM,
  Cell.CONCRETE_LEFT,
  Cell.CONCRETE_LEFT_BOTTOM,
  Cell.CONCRETE_RIGHT_BOTTOM,
];

export const BrickCells: Cell[] = [
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
