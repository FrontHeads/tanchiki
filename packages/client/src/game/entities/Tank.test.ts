import { Direction } from '../typings';
import { Projectile, Tank } from './';

describe('game/entities/Tank', () => {
  it('should shoot', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });

    const projectile = tank.shoot();

    expect(projectile instanceof Projectile).toBe(true);
  });

  it('should determine projectile starting position', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });

    const projectile = tank.shoot();

    expect(projectile.width).toBe(2);
    expect(projectile.height).toBe(2);
    expect(projectile.posX).toBe(2);
    expect(projectile.posY).toBe(4);
  });
});
