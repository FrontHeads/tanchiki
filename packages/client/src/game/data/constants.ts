import { type EntityDynamicSettings, Cell, Player, ScreenType } from '../typings';
import {
  GameOverPopupScreen,
  GameStartScreen,
  LevelSelectorScreen,
  LoadingScreen,
  MainMenuScreen,
  PausePopupScreen,
  ScoreScreen,
} from '../ui/screens';
import { Color } from './colors';
import { classicDesignSprite } from './spriteCoordinates';

//TODO: task103 move to mapmanager
export const concreteCells: Cell[] = [
  Cell.Concrete,
  Cell.ConcreteTop,
  Cell.ConcreteRight,
  Cell.ConcreteBottom,
  Cell.ConcreteLeft,
  Cell.ConcreteBottomLeft,
  Cell.ConcreteBottomRight,
];

//TODO: task103 move tomapmanager
export const brickCells: Cell[] = [
  Cell.Brick,
  Cell.BrickTop,
  Cell.BrickRight,
  Cell.BrickBottom,
  Cell.BrickLeft,
  Cell.BrickBottomLeft,
  Cell.BrickBottomRight,
];
//TODO: task103 move to screens
export const screenClasses = {
  [ScreenType.Loading]: LoadingScreen,
  [ScreenType.MainMenu]: MainMenuScreen,
  [ScreenType.LevelSelector]: LevelSelectorScreen,
  [ScreenType.GameStart]: GameStartScreen,
  [ScreenType.Pause]: PausePopupScreen,
  [ScreenType.Score]: ScoreScreen,
  [ScreenType.GameOverPopup]: GameOverPopupScreen,
};

//TODO: task103 move to  scenario
export const playerInitialSettings: Record<Player, EntityDynamicSettings> = {
  [Player.Player1]: { posX: 18, posY: 50, color: Color.Yellow, variant: 'PLAYER1' },
  [Player.Player2]: { posX: 34, posY: 50, color: Color.Lime, variant: 'PLAYER2' },
};

/**
 * Координаты клеток на карте, на которых спаунятся танки
 * Используются при расстановке вражеских танков на поле
 * и при проверке карты уровня на случай, если в эти клетки
 * был установлен какой-то предмет
 */
export const spawnPlaces: Record<number, number[]> = {
  //mapmanager
  0: [0, 6, 12],
  12: [4, 8],
};

//TODO тут будут координаты для спрайта с современным дизайном.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modernDesignSprite = {}; //view

/** Координаты сущностей на sprite-изображении */
export const spriteCoordinates = classicDesignSprite; //view
