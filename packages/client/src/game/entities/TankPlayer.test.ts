import { Direction } from '../typings';
import { TankPlayer } from './';

function mockTank() {
  const tank = new TankPlayer({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
  return tank;
}

describe('game/entities/TankPlayer', () => {
  it('should be invincible immediately after spawn (until shield animation end)', () => {
    const tank = mockTank();
    tank.spawn();

    expect(tank.invincible).toBeTruthy();
  });
});
