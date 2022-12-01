import { Direction } from '../typings';
import { EntityDynamic } from './';

function mockEntityDynamic() {
  const entity = new EntityDynamic({ posX: 0, posY: 0, width: 4, height: 4, direction: Direction.RIGHT });
  entity.moveSpeed = 2;
  entity.movePace = 2;
  entity.moveStepsTotal = 12;
  entity.spawned = true;
  return entity;
}

describe('game/entities/EntityDynamic', () => {
  it('should turn', () => {
    const entity = mockEntityDynamic();

    entity.turn(Direction.UP);

    expect(entity.direction).toBe(Direction.UP);
  });

  it('should start moving', () => {
    const entity = mockEntityDynamic();

    entity.move(Direction.DOWN);

    expect(entity.moving).toBe(true);
    expect(entity).toHaveProperty('nextDirection', Direction.DOWN);
    expect(entity).toHaveProperty('canMove', true);
  });

  it('should calculate next move based on speed', () => {
    const entity = mockEntityDynamic();

    const nextMiniMove = entity.getNextMove();
    const nextFullMove = entity.getNextMove(true);

    expect(nextMiniMove).toEqual({ posX: 0.2 });
    expect(nextFullMove).toEqual({ posX: 2 });
  });

  it('should move by steps', () => {
    const entity = mockEntityDynamic();
    const ticks = 5;

    entity.move(Direction.RIGHT);
    for (let i = 0; i < ticks; ++i) {
      entity.step();
    }

    expect(entity.posX).toBe(1);
    expect(entity).toHaveProperty('alignedToGrid', false);
  });

  it('should turn without moving', () => {
    const entity = mockEntityDynamic();
    const ticks = 5;

    entity.move(Direction.DOWN);
    for (let i = 0; i < ticks; ++i) {
      entity.step();
    }

    expect(entity.direction).toBe(Direction.DOWN);
    expect(entity.posX).toBe(0);
    expect(entity.posY).toBe(0);
  });

  it('should not turn while is not aligned to grid', () => {
    const entity = mockEntityDynamic();
    const ticks = 5;

    entity.move(Direction.RIGHT);
    for (let i = 0; i < ticks; ++i) {
      entity.step();
    }
    entity.move(Direction.DOWN);

    expect(entity.direction).toBe(Direction.RIGHT);
  });

  it('should turn after making full move', () => {
    const entity = mockEntityDynamic();
    const ticks = 5;

    entity.move(Direction.RIGHT);
    for (let i = 0; i < ticks; ++i) {
      entity.step();
    }
    entity.move(Direction.DOWN);
    for (let i = 0; i < 10; ++i) {
      entity.step();
    }

    expect(entity.direction).toBe(Direction.DOWN);
  });
});
