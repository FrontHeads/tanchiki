import { spriteCoordinates } from '../data/constants';
import { Loop, View } from '../services';
import { Direction, EntityEvent } from '../typings';
import { sleep } from '../utils';
import { Explosion, Projectile, TankEnemy } from './';

describe('game/entities/Explosion', () => {
  it('should have right properties', () => {
    const tank = {} as TankEnemy;
    const projectile = new Projectile({ parent: tank, posX: 0, posY: 0, moveSpeed: 2, direction: Direction.LEFT });
    const explosion = new Explosion({ parent: projectile });

    expect(explosion).toHaveProperty('crossable', true);
    expect(explosion).toHaveProperty('hittable', false);
    expect(explosion).toHaveProperty('mainSpriteCoordinates', spriteCoordinates['projectileExplosion']);
  });

  it('should despawn after showing', async () => {
    const loop = new Loop();
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));
    const tank = { posX: 2, posY: 2, width: 4, height: 4 } as TankEnemy;
    const explosion = new Explosion({ parent: tank });
    const despawnObserver = jest.fn();

    loop.load();
    loop.add(explosion);
    view.load(root);
    view.add(explosion);
    explosion.on(EntityEvent.DESPAWN, despawnObserver);
    explosion.spawn();

    await sleep(500);

    expect(explosion.spawned).toBe(false);
    expect(despawnObserver).toHaveBeenCalled();
  });
});
