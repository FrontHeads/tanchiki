import { Game } from '../../services';
import { Overlay } from '../';

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('game/ui/Overlay', () => {
  it('should render elements', () => {
    const game = Game.create();
    game.view.drawOnLayer = jest.fn();
    const root = document.body.appendChild(document.createElement('div'));
    const overlay = new Overlay(game);

    game.view.load(root);
    overlay.renderElement({ posX: 0, posY: 0, width: 2, height: 2 });

    expect(game.view.drawOnLayer).toHaveBeenCalled();
  });

  it('should use animations', async () => {
    const game = Game.create();
    const overlay = new Overlay(game);
    const mockFn = jest.fn();
    const animationTicksCount = 5;
    const animateFunction = (stage: number) => {
      if (stage > animationTicksCount) {
        return false;
      }
      mockFn();
      return true;
    };

    overlay.animate(animateFunction);

    await sleep(300);

    expect(mockFn).toHaveBeenCalledTimes(animationTicksCount);
  });
});
