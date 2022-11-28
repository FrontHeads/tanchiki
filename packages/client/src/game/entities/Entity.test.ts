import { Entity } from './';

describe('game/entities/Entity', () => {
  it('should set state', () => {
    const entity = new Entity({ width: 4, height: 4 });
    const mockFn = jest.fn();
    const state = { posX: 111, posY: 222 };

    entity.on('entityShouldUpdate', mockFn);
    entity.on('entityDidUpdate', mockFn);
    entity.setState(state);

    expect(entity).toHaveProperty('posX', 111);
    expect(entity).toHaveProperty('posY', 222);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith(state);
  });

  it('should return its own rect', () => {
    const rect = { posX: 0, posY: 0, width: 4, height: 4 };
    const entity = new Entity(rect);

    expect(entity.getRect()).toEqual(rect);
  });

  it('should spawn', () => {
    const entity = new Entity({ posX: 0, posY: 0, width: 4, height: 4 });

    entity.spawn({ posX: 1, posY: 2 });

    expect(entity).toHaveProperty('spawned', true);
    expect(entity.posX).toBe(1);
    expect(entity.posY).toBe(2);
  });

  it('should despawn', () => {
    const entity = new Entity({ posX: 0, posY: 0, width: 4, height: 4 });
    const mockFn = jest.fn();

    entity.on('entityShouldBeDestroyed', mockFn);
    entity.spawn({ posX: 1, posY: 2 });
    entity.despawn();

    expect(entity.spawned).toBe(false);
    expect(mockFn).toHaveBeenCalled();
  });
});
