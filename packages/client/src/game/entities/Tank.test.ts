import { Zone } from '../services';
import { Direction } from '../typings';
import { Projectile, Tank } from './';

describe('game/entities/Tank', () => {
  it('should shoot', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    tank.on('shoot', mockFn);
    tank.shoot();

    const projectile = mockFn.mock.calls[0][0];
    expect(projectile instanceof Projectile).toBe(true);
  });

  it('should determine projectile starting position', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    tank.on('shoot', mockFn);
    tank.shoot();

    const projectile = mockFn.mock.calls[0][0];
    expect(projectile.width).toBe(2);
    expect(projectile.height).toBe(2);
    expect(projectile.posX).toBe(2);
    expect(projectile.posY).toBe(2);
  });

  it('shouldn`t shoot before projectile exploded', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    tank.on('shoot', mockFn);
    tank.shoot();

    const projectileOne = mockFn.mock.calls[0][0];
    const projectileTwo = mockFn.mock.calls[1]?.[0];

    expect(projectileOne).toBeTruthy();
    expect(projectileTwo).toBeFalsy();
  });

  it('should shoot after projectile exploded', async () => {
    const zone = new Zone({ width: 6, height: 6 });
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    tank.on('shoot', mockFn);
    tank.shoot();
    tank.shoot();

    const projectileOne = mockFn.mock.calls[0][0];
    const projectileTwo = mockFn.mock.calls[1]?.[0];

    expect(projectileOne).toBeTruthy();
    expect(projectileTwo).toBeFalsy();

    zone.add(projectileOne);
    projectileOne.spawn();

    projectileOne.update();
    projectileOne.update();
    projectileOne.update();
    projectileOne.update();
    projectileOne.update();

    expect(projectileOne).toHaveProperty('shouldBeDestroyed', true);

    tank.shoot();

    const projectileThree = mockFn.mock.calls[1]?.[0];
    expect(projectileThree).toBeTruthy();
  });
});
