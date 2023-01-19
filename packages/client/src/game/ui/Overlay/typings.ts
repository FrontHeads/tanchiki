import {
  GameOverPopupScreen,
  GameStartScreen,
  LevelSelectorScreen,
  LoadingScreen,
  MainMenuScreen,
  PausePopupScreen,
  ScoreScreen,
} from '../screens';
import { ScreenType } from '../screens/data';

export const screenClasses = {
  [ScreenType.Loading]: LoadingScreen,
  [ScreenType.MainMenu]: MainMenuScreen,
  [ScreenType.LevelSelector]: LevelSelectorScreen,
  [ScreenType.GameStart]: GameStartScreen,
  [ScreenType.Pause]: PausePopupScreen,
  [ScreenType.Score]: ScoreScreen,
  [ScreenType.GameOverPopup]: GameOverPopupScreen,
};
