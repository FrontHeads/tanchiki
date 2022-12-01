import { Zone } from '../services';
import { Direction } from '../typings';
import { Projectile } from './';

describe('game/entities/Projectile', () => {
  it('should have projectile props', () => {
    const projectile = new Projectile({ posX: 0, posY: 0, moveSpeed: 2, direction: Direction.LEFT });

    expect(projectile).toHaveProperty('flying', true);
    expect(projectile).toHaveProperty('moveSpeed', 2);
  });

  it('should explode on impact', () => {
    const zone = new Zone({ width: 2, height: 2 });
    const projectile = new Projectile({ posX: 0, posY: 0, moveSpeed: 2, direction: Direction.LEFT });
    zone.registerEntity(projectile);

    projectile.spawn({ posX: 0, posY: 0 });
    projectile.step();

    expect(projectile).toHaveProperty('shouldExplode', true);
  });
});
