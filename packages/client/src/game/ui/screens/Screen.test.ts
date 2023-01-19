import { Game } from '../../services';
import { ScreenType } from '../../typings';
import { Overlay } from '..';

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
