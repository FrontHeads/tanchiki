import { Zone } from '../services';
import { Direction } from '../typings';
import { EntityEvent } from './../typings/index';
import { Projectile, Tank } from './';

describe('game/entities/Tank', () => {
  it('should shoot', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.on(EntityEvent.SHOOT, mockFn);
    tank.shoot();

    const projectile = mockFn.mock.calls[0][0];
    expect(projectile instanceof Projectile).toBe(true);
  });

  it('shouldn`t be able to shoot immediately after spawn (wait for spawn animation)', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    tank.on(EntityEvent.SHOOT, mockFn);
    tank.shoot();

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should be invincible immediately after spawn (until shield animation end)', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    tank.spawn();

    expect(tank.invincible).toBeTruthy();
  });

  it('shouldn`t be able to move immediately after spawn (until spawn animation end)', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    tank.spawn();

    expect(tank.frozen).toBeTruthy();
  });

  it('should determine projectile starting position', () => {
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.on(EntityEvent.SHOOT, mockFn);
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
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.on(EntityEvent.SHOOT, mockFn);
    tank.shoot();

    const projectileOne = mockFn.mock.calls[0][0];
    const projectileTwo = mockFn.mock.calls[1]?.[0];

    expect(projectileOne).toBeTruthy();
    expect(projectileTwo).toBeFalsy();
  });

  it('should shoot after projectile exploded', () => {
    const zone = new Zone({ width: 6, height: 6 });
    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.on(EntityEvent.SHOOT, mockFn);
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
