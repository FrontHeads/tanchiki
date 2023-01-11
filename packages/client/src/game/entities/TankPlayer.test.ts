import { Direction, EntityEvent } from '../typings';
import { Loop } from '../services';
import { TankPlayer } from './';
import { sleep } from '../utils';

function mockTank() {
  const tank = new TankPlayer({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
  return tank;
}

describe('game/entities/TankPlayer', () => {
  it('should be invincible immediately after spawn (until shield animation end)', async () => {
    const loop = new Loop();
    const tank = mockTank();
    const readyObserver = jest.fn();
    tank.spawnTimeout = 500;

    loop.load();
    loop.add(tank);
    tank.spawn();
    tank.on(EntityEvent.READY, readyObserver);

    await sleep(1000);

    expect(readyObserver).toHaveBeenCalled();
    expect(tank.invincible).toBeTruthy();
  });
});
