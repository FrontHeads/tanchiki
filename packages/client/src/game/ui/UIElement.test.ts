import { UIElement } from '../ui';

describe('game/ui/UIElement', () => {
  it('should render', () => {
    const elem = new UIElement({ posX: 0, posY: 0, width: 10, height: 2 });
    const mockFn = jest.fn();

    elem.on('entityShouldUpdate', mockFn);
    elem.on('entityDidUpdate', mockFn);
    elem.render();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should render text', () => {
    const elem = new UIElement({ posX: 0, posY: 0, width: 10, height: 2, text: 'test' });
    const mockFn = jest.fn();

    elem.on('entityShouldRenderText', mockFn);
    elem.render();

    expect(mockFn).toHaveBeenCalled();
  });
});
