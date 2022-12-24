import { UIElement } from '../ui';
import { EntityEvent } from './../typings/index';

describe('game/ui/UIElement', () => {
  it('should render', () => {
    const elem = new UIElement({ posX: 0, posY: 0, width: 10, height: 2 });
    const mockFn = jest.fn();

    elem.on(EntityEvent.SHOULD_UPDATE, mockFn);
    elem.on(EntityEvent.DID_UPDATE, mockFn);
    elem.render();

    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should render text', () => {
    const elem = new UIElement({ posX: 0, posY: 0, width: 10, height: 2, text: 'test' });
    const mockFn = jest.fn();

    elem.on(EntityEvent.SHOULD_RENDER_TEXT, mockFn);
    elem.render();

    expect(mockFn).toHaveBeenCalled();
  });
});
