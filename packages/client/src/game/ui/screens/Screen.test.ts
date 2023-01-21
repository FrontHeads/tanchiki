import { Game } from '../../services';
import { Overlay } from '../';
import { ScreenType } from './data';

const mockShow = jest.fn();
jest.mock('./UIScreens/MainMenuScreen', () => {
  return {
    MainMenuScreen: jest.fn().mockImplementation(() => {
      return {
        show: mockShow,
      };
    }),
  };
});

describe('game/ui/screens/Screen', () => {
  it('should call Screen.show()', () => {
    const game = Game.create();
    const overlay = new Overlay(game);
    overlay.show(ScreenType.MainMenu);

    expect(mockShow).toHaveBeenCalled();
  });
});
