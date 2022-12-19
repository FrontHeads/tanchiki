import { spriteCoordinates } from '../data/constants';
import { Explosion } from './';

describe('game/entities/Explosion', () => {
  it('should have right explosion properties', () => {
    const explosion = new Explosion({ type: 'projectileExplosion', posX: 0, posY: 0, width: 4, height: 4 });

    expect(explosion).toHaveProperty('crossable', true);
    expect(explosion).toHaveProperty('hittable', false);
    expect(explosion).toHaveProperty('mainSpriteCoordinates', spriteCoordinates['projectileExplosion']);
  });
});
