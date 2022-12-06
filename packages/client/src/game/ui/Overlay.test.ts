import { View } from '../services';
import { Overlay } from './';

async function sleep(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('game/ui/Overlay', () => {
  it('should render elements', () => {
    const view = new View({ width: 10, height: 10 });
    view.drawEntityOnLayer = jest.fn();
    const root = document.body.appendChild(document.createElement('div'));
    const overlay = new Overlay(view);

    view.build(root);
    overlay.renderElement({ posX: 0, posY: 0, width: 2, height: 2 });

    expect(view.drawEntityOnLayer).toHaveBeenCalled();
  });

  it('should use animations', async () => {
    const view = new View({ width: 10, height: 10 });
    const overlay = new Overlay(view);
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
