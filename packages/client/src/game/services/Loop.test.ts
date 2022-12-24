import { Tank } from '../entities';
import { Loop } from './';
import { sleep } from '../utils';

function mockEntity() {
  const entity = new Tank({ posX: 0, posY: 0 });
  entity.update = jest.fn();
  return entity;
}

describe('game/services/Loop', () => {
  it('should add entities', async () => {
    const loop = new Loop();
    loop.loopTimeMs = 100;
    const entity = mockEntity();

    loop.add(entity);
    loop.start();

    await sleep(200);

    expect(entity.update).toHaveBeenCalled();
  });

  it('should stop loop', () => {
    const loop = new Loop();

    loop.start();
    loop.stop();

    expect(loop.loopProcess).toBe(null);
  });

  it('should set loop delays', async () => {
    const loop = new Loop();
    const entity = mockEntity();
    const delay = 100;
    const mockFn = jest.fn();
    const mockFn2 = jest.fn();

    loop.start();
    loop.add(entity);
    entity.setLoopDelay(mockFn, delay);
    loop.setLoopDelay(mockFn2, delay);

    await sleep(200);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  it('should clear loop delays', async () => {
    const loop = new Loop();
    const entity = mockEntity();
    const delay = 100;
    const mockFn = jest.fn();

    loop.start();
    loop.add(entity);
    entity.setLoopDelay(mockFn, delay);
    loop.clearLoopDelays();

    await sleep(200);

    expect(mockFn).not.toHaveBeenCalled();
  });
});
