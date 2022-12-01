import { EventEmitter } from './EventEmitter';

describe('utils/EventEmitter', () => {
  it('should subscribe to and publish custom events', () => {
    const eventEmitter = new EventEmitter();
    const mockFn = jest.fn();

    eventEmitter.on('mockEvent', mockFn);
    eventEmitter.emit('mockEvent', 'mockParam');

    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('mockParam');
  });

  it('should unsubscribe from custom events', () => {
    const eventEmitter = new EventEmitter();
    const mockFn = jest.fn();

    eventEmitter.on('mockEvent', mockFn);
    eventEmitter.off('mockEvent', mockFn);
    eventEmitter.emit('mockEvent', 'mockParam');

    expect(mockFn).not.toHaveBeenCalled();
  });
});