import { type Game, Loop, View } from '../../services';
import { spriteCoordinates } from '../../services/View/spriteCoordinates';
import { sleep } from '../../utils';
import { type TankEnemy, Explosion, Projectile } from '../';
import { Direction, EntityEvent } from '../Entity/typings';

describe('game/entities/Explosion', () => {
  it('should have right properties', () => {
    const tank = {} as TankEnemy;
    const projectile = new Projectile({ parent: tank, posX: 0, posY: 0, moveSpeed: 2, direction: Direction.Left });
    const explosion = new Explosion({ parent: projectile });

    expect(explosion).toHaveProperty('crossable', true);
    expect(explosion).toHaveProperty('hittable', false);
    expect(explosion).toHaveProperty('mainSpriteCoordinates', spriteCoordinates['projectileExplosion']);
  });

  it('should despawn after showing', async () => {
    const game = { state: { width: 10, height: 10 } } as Game;
    const loop = new Loop();
    const view = new View(game);
    const root = document.body.appendChild(document.createElement('div'));
    const tank = { posX: 2, posY: 2, width: 4, height: 4 } as TankEnemy;
    const explosion = new Explosion({ parent: tank });
    const despawnObserver = jest.fn();

    loop.load();
    loop.add(explosion);
    view.load(root);
    view.add(explosion);
    explosion.on(EntityEvent.Despawn, despawnObserver);
    explosion.spawn();

    await sleep(500);

    expect(explosion.spawned).toBe(false);
    expect(despawnObserver).toHaveBeenCalled();
  });
});
