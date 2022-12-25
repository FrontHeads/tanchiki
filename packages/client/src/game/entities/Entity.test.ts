import { spriteCoordinates } from '../data/constants';
import { Game } from '../services';
import { EntityEvent } from '../typings';
import { sleep } from '../utils/sleepTimer';
import { Entity } from './';

describe('game/entities/Entity', () => {
  it('should set state', () => {
    const entity = new Entity({ posX: 0, posY: 0, width: 4, height: 4 });
    const mockFn = jest.fn();
    const state = { posX: 111, posY: 222 };

    entity.on(EntityEvent.SHOULD_UPDATE, mockFn);
    entity.on(EntityEvent.DID_UPDATE, mockFn);
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

    entity.on(EntityEvent.SHOULD_BE_DESTROYED, mockFn);
    entity.spawn({ posX: 1, posY: 2 });
    entity.despawn();

    expect(entity.spawned).toBe(false);
    expect(mockFn).toHaveBeenCalled();
  });

  it('should take damage', () => {
    const entity = new Entity({ posX: 0, posY: 0, width: 4, height: 4 });
    const source = new Entity({ posX: 4, posY: 4, width: 4, height: 4 });
    const mockFn = jest.fn();

    entity.on(EntityEvent.DAMAGED, mockFn);
    entity.spawn({ posX: 1, posY: 2 });
    entity.takeDamage(source, { posX: 3, posY: 3, width: 1, height: 1 });

    expect(mockFn).toHaveBeenCalled();
  });

  it('should stop animation by stopTimer', async () => {
    const game = Game.create();
    game.loop.start();
    const entity = new Entity({ posX: 0, posY: 0, width: 4, height: 4 });
    game.loop.registerTimerHandlers(entity);

    const cancelAnimationSpy = jest.spyOn(entity, 'cancelAnimation');

    entity.on(EntityEvent.SPAWN, () => {
      entity.startAnimation({
        delay: 25,
        spriteCoordinates: spriteCoordinates['terrain.water'],
        looped: true,
        stopTimer: 50,
      });
    });

    entity.spawn({ posX: 1, posY: 1 });
    await sleep(100);

    expect(cancelAnimationSpy).toHaveBeenCalled();
  });
});
