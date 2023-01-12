import { Zone } from '../services';
import { Direction } from '../typings';
import { type Tank,Projectile } from './';

describe('game/entities/Projectile', () => {
  it('should have projectile props', () => {
    const tank = {} as Tank;
    const projectile = new Projectile({ parent: tank, posX: 0, posY: 0, moveSpeed: 2, direction: Direction.Left });

    expect(projectile).toHaveProperty('flying', true);
    expect(projectile).toHaveProperty('moveSpeed', 2);
  });

  it('should explode on impact', () => {
    const zone = new Zone({ width: 2, height: 2 });
    const tank = {} as Tank;
    const projectile = new Projectile({ parent: tank, posX: 0, posY: 0, moveSpeed: 2, direction: Direction.Left });
    zone.add(projectile);

    projectile.spawn({ posX: 0, posY: 0 });
    projectile.update();
    projectile.update();
    projectile.update();

    expect(projectile).toHaveProperty('shouldBeDestroyed', true);
  });
});
