import { Loop } from '../../services';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { sleep } from '../../utils';
import { type TankEnemy, Score } from '../';
import { EntityEvent } from '../Entity/typings';

describe('game/entities/Score', () => {
  it('should have right properties', () => {
    const tank = { posX: 1, posY: 1, width: 2, height: 2, variant: 'FAST' } as TankEnemy;
    const score = new Score({ points: 200, parent: tank });

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
    const tank = { posX: 1, posY: 1, width: 2, height: 2, variant: 'FAST' } as TankEnemy;
    const score = new Score({ points: 200, parent: tank });
    const despawnObserver = jest.fn();

    loop.load();
    loop.add(score);
    score.spawn();
    score.on(EntityEvent.Despawn, despawnObserver);

    await sleep(500);

    expect(score.spawned).toBe(false);
    expect(despawnObserver).toHaveBeenCalled();
  });
});
