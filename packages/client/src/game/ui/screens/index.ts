/* eslint-disable simple-import-sort/exports */
import { ScreenType } from '../../typings';
import { LevelSelectorScreen } from './LevelSelectorScreen';
import { MainMenuScreen } from './MainMenuScreen';

export { Screen } from './Screen';
export { LevelSelectorScreen } from './LevelSelectorScreen';
export { MainMenuScreen } from './MainMenuScreen';

export const screenClasses = {
  [ScreenType.MAIN_MENU]: MainMenuScreen,
  [ScreenType.LOADING]: MainMenuScreen,
  [ScreenType.LEVEL_SELECTOR]: LevelSelectorScreen,
  [ScreenType.GAME]: MainMenuScreen,
};
