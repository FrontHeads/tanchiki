import { EventBus } from './EventBus';

describe('utils/EventBus', () => {
  it('should subscribe to and publish custom events', () => {
    const eventBus = new EventBus();
    const mockFn = jest.fn();

    eventBus.on('mockEvent', mockFn);
    eventBus.emit('mockEvent', 'mockParam');

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('mockParam');
  });

  it('should unsubscribe from custom events', () => {
    const eventBus = new EventBus();
    const mockFn = jest.fn();

    eventBus.on('mockEvent', mockFn);
    eventBus.off('mockEvent', mockFn);
    eventBus.emit('mockEvent', 'mockParam');

    expect(mockFn).not.toHaveBeenCalled();
  });
});
