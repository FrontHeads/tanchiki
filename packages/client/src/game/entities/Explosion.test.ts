import { spriteCoordinates } from '../data/constants';
import { Direction } from '../typings';
import { Explosion, Tank } from './';
import { Projectile } from './Projectile';

describe('game/entities/Explosion', () => {
  it('should have right explosion properties', () => {
    const tank = {} as Tank;
    const projectile = new Projectile({ parent: tank, posX: 0, posY: 0, moveSpeed: 2, direction: Direction.LEFT });
    const explosion = new Explosion({ parentEntity: projectile });

    expect(explosion).toHaveProperty('crossable', true);
    expect(explosion).toHaveProperty('hittable', false);
    expect(explosion).toHaveProperty('mainSpriteCoordinates', spriteCoordinates['projectileExplosion']);
  });
});
