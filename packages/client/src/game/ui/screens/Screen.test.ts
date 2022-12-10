import { View } from '../../services/View';
import { ScreenType } from '../../typings';
import { Overlay } from '../Overlay';

const mockShow = jest.fn();
jest.mock('./MainMenuScreen', () => {
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
    const view = new View({ width: 10, height: 10 });
    const overlay = new Overlay(view);
    overlay.show(ScreenType.MAIN_MENU);

    expect(mockShow).toHaveBeenCalled();
  });
});
