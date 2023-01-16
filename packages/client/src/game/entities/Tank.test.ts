import { Zone } from '../services';
import { Direction, EntityEvent } from '../typings';
import { Projectile, TankPlayer, Terrain } from './';

function mockTank() {
  const tank = new TankPlayer({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.Down });
  return tank;
}

describe('game/entities/Tank', () => {
  it('should shoot', () => {
    const tank = mockTank();
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.frozen = false;

    tank.on(EntityEvent.Shoot, mockFn);
    tank.shoot();
    tank.update();

    const projectile = mockFn.mock.calls[0][0];
    expect(projectile instanceof Projectile).toBe(true);
  });

  it('shouldn`t be able to shoot immediately after spawn (wait for spawn animation)', () => {
    const tank = mockTank();
    const mockFn = jest.fn();

    tank.spawn();
    tank.frozen = false;
    tank.on(EntityEvent.Shoot, mockFn);
    tank.shoot();
    tank.update();

    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('shouldn`t be able to move immediately after spawn (until spawn animation end)', () => {
    const tank = mockTank();
    tank.spawn();

    expect(tank.frozen).toBeTruthy();
  });

  it('should determine projectile starting position', () => {
    const tank = mockTank();
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.frozen = false;
    tank.on(EntityEvent.Shoot, mockFn);
    tank.shoot();
    tank.update();

    const projectile = mockFn.mock.calls[0][0];
    expect(projectile.width).toBe(2);
    expect(projectile.height).toBe(2);
    expect(projectile.posX).toBe(2);
    expect(projectile.posY).toBe(2);
  });

  it('shouldn`t shoot before projectile exploded', () => {
    const tank = mockTank();
    const mockFn = jest.fn();

    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.frozen = false;
    tank.on(EntityEvent.Shoot, mockFn);
    tank.shoot();
    tank.update();
    tank.shoot();
    tank.update();

    const projectileOne = mockFn.mock.calls[0][0];
    const projectileTwo = mockFn.mock.calls[1]?.[0];

    expect(projectileOne).toBeTruthy();
    expect(projectileTwo).toBeFalsy();
  });

  it('should shoot after projectile exploded', () => {
    const zone = new Zone({ width: 6, height: 6 });
    const tank = mockTank();
    const mockFn = jest.fn();
    const projectileUpdateCycles = 10;

    zone.add(tank);
    tank.spawn();
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    tank.canShoot = true;
    tank.frozen = false;
    tank.on(EntityEvent.Shoot, mockFn);
    tank.shoot();
    tank.update();
    tank.shoot();
    tank.update();

    const projectileOne = mockFn.mock.calls[0][0];
    const projectileTwo = mockFn.mock.calls[1]?.[0];

    expect(projectileOne).toBeTruthy();
    expect(projectileTwo).toBeFalsy();

    zone.add(projectileOne);
    projectileOne.spawn();

    for (let i = projectileUpdateCycles; i > 0; --i) {
      projectileOne.update();
    }

    expect(projectileOne).toHaveProperty('shouldBeDestroyed', true);

    tank.shoot();
    tank.update();

    const projectileThree = mockFn.mock.calls[1]?.[0];
    expect(projectileThree).toBeTruthy();
  });

  it('should slide on ice', () => {
    const zone = new Zone({ width: 10, height: 10 });
    const ice = new Terrain({ type: 'ice', posX: 0, posY: 1, width: 9, height: 9 });
    const tank = mockTank();
    const slideObserver = jest.fn();
    const tankUpdateCycles = 30;
    tank.on(EntityEvent.Slide, slideObserver);

    zone.add(ice);
    ice.spawn();
    zone.add(tank);
    tank.spawn({ posX: 0, posY: 0 });
    tank.frozen = false;
    tank.move(Direction.Down);
    tank.update();
    tank.stop();

    expect(tank.sliding).toBe(true);

    for (let i = tankUpdateCycles; i > 0; --i) {
      tank.update();
    }

    expect(tank.sliding).toBe(false);
    expect(tank.posY).toBeGreaterThan(2);
    expect(slideObserver).toHaveBeenCalledTimes(1);
  });

  it('should stop on ice edge after sliding', () => {
    const zone = new Zone({ width: 10, height: 10 });
    const ice = new Terrain({ type: 'ice', posX: 0, posY: 1, width: 4, height: 4 });
    const tank = mockTank();
    const tankUpdateCycles = 30;

    zone.add(ice);
    ice.spawn();
    zone.add(tank);
    tank.spawn({ posX: 0, posY: 0 });
    tank.frozen = false;
    tank.move(Direction.Down);
    tank.update();
    tank.stop();

    for (let i = tankUpdateCycles; i > 0; --i) {
      tank.update();
    }

    expect(tank.sliding).toBe(false);
    expect(tank.posY).toBe(4);
  });
});
