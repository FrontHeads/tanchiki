import { spriteCoordinates } from '../data/constants';
import { Score, TankEnemy } from './';
import { EntityEvent } from '../typings';
import { sleep } from '../utils';
import { Loop } from '../services';

describe('game/entities/Score', () => {
  it('should have right properties', () => {
    const tank = { posX: 1, posY: 1, width: 2, height: 2, scorePoints: 200 } as TankEnemy;
    const score = new Score({ parentEntity: tank });

    expect(score).toHaveProperty('crossable', true);
    expect(score).toHaveProperty('hittable', false);
    expect(score).toHaveProperty('posX', 1);
    expect(score).toHaveProperty('posY', 1);
    expect(score).toHaveProperty('width', 2);
    expect(score).toHaveProperty('height', 2);
    expect(score).toHaveProperty('mainSpriteCoordinates', spriteCoordinates['points.200']);
  });

  it('should despawn after showing', async () => {
    const loop = new Loop();
    const tank = { posX: 1, posY: 1, width: 2, height: 2, scorePoints: 200 } as TankEnemy;
    const score = new Score({ parentEntity: tank });
    const despawnObserver = jest.fn();

    loop.load();
    loop.add(score);
    score.spawn();
    score.on(EntityEvent.DESPAWN, despawnObserver);

    await sleep(500);

    expect(score.spawned).toBe(false);
    expect(despawnObserver).toHaveBeenCalled();
  });
});
