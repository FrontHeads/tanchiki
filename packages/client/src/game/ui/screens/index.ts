import { ScreenType } from '../../typings';
import { GameOverScreen } from './GameOverScreen';
import { GameScreen } from './GameScreen';
import { LevelSelectorScreen } from './LevelSelectorScreen';
import { LoadingScreen } from './LoadingScreen';
import { MainMenuScreen } from './MainMenuScreen';

export { GameOverScreen } from './GameOverScreen';
export { GameScreen } from './GameScreen';
export { LevelSelectorScreen } from './LevelSelectorScreen';
export { LoadingScreen } from './LoadingScreen';
export { MainMenuScreen } from './MainMenuScreen';
export { Screen } from './Screen';

export const screenClasses = {
  [ScreenType.MAIN_MENU]: MainMenuScreen,
  [ScreenType.LOADING]: LoadingScreen,
  [ScreenType.LEVEL_SELECTOR]: LevelSelectorScreen,
  [ScreenType.GAME]: GameScreen,
  [ScreenType.GAME_OVER]: GameOverScreen,
};
