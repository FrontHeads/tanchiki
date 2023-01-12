import { Loop } from '../services';
import { Direction, EntityEvent } from '../typings';
import { sleep } from '../utils';
import { TankPlayer } from './';

function mockTank() {
  const tank = new TankPlayer({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.Down });
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
    tank.on(EntityEvent.Ready, readyObserver);

    await sleep(1000);

    expect(readyObserver).toHaveBeenCalled();
    expect(tank.invincible).toBeTruthy();
  });
});
