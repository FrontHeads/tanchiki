import { type Entity, Tank, Terrain } from '../../entities';
import { type Rect, EntityEvent } from '../../entities/Entity/typings';
import { type Game, Zone } from '../';

function mockEntity(rect: Rect) {
  const entity = new Tank(rect);
  entity.spawned = true;
  return entity;
}

const game = { state: { width: 10, height: 10 } } as Game;

describe('game/services/Zone', () => {
  it('should build matrix on init', () => {
    const zone = new Zone(game);

    expect(zone.matrix.length).toBe(4);
    expect(zone.matrix[0].length).toBe(10);
    expect(zone.matrix[0][9].length).toBe(10);
    expect(zone.matrix[0][0][0]).toBe(null);
    expect(zone.matrix[0][9][9]).toBe(null);
    expect(zone.matrix[0][9][10]).toBe(undefined);
  });

  it('should reset matrix', () => {
    const zone = new Zone(game);
    const rect = { posX: 0, posY: 0, width: 2, height: 2 };
    const entity = {} as Entity;

    zone.updateMatrix(0, rect, entity);
    zone.reset();

    expect(zone.matrix[0][0][0]).toBe(null);
    expect(zone.matrix[0][0][1]).toBe(null);
    expect(zone.matrix[0][1][0]).toBe(null);
    expect(zone.matrix[0][1][1]).toBe(null);
  });

  it('should update matrix', () => {
    const zone = new Zone(game);
    const rect = { posX: 1, posY: 1, width: 2, height: 2 };
    const entity = {} as Entity;

    zone.updateMatrix(0, rect, entity);

    expect(zone.matrix[0][1][1]).toBe(entity);
    expect(zone.matrix[0][1][2]).toBe(entity);
    expect(zone.matrix[0][2][1]).toBe(entity);
    expect(zone.matrix[0][2][2]).toBe(entity);
    expect(zone.matrix[0][1][0]).toBe(null);
    expect(zone.matrix[0][2][3]).toBe(null);
  });

  it('should check if entity rect is beyond matrix', () => {
    const zone = new Zone(game);
    const rect1 = { posX: -1, posY: -1, width: 1, height: 1 };
    const rect2 = { posX: 1, posY: 1, width: 1, height: 1 };
    const rect3 = { posX: 1, posY: 1, width: 10, height: 1 };
    const rect4 = { posX: 1, posY: 10, width: 1, height: 1 };

    expect(zone.isBeyondMatrix(rect1)).toBe(true);
    expect(zone.isBeyondMatrix(rect2)).toBe(false);
    expect(zone.isBeyondMatrix(rect3)).toBe(true);
    expect(zone.isBeyondMatrix(rect4)).toBe(true);
  });

  it('should check if entity rect does not have floats', () => {
    const zone = new Zone(game);
    const rect1 = { posX: 1.5, posY: 1, width: 1, height: 1 };
    const rect2 = { posX: 1, posY: 1.5, width: 1, height: 1 };
    const rect3 = { posX: 1, posY: 1, width: 1.5, height: 1 };
    const rect4 = { posX: 1, posY: 1, width: 1, height: 1.5 };
    const rect5 = { posX: 1, posY: 1, width: 1, height: 1 };

    expect(zone.isLegalRect(rect1)).toBe(false);
    expect(zone.isLegalRect(rect2)).toBe(false);
    expect(zone.isLegalRect(rect3)).toBe(false);
    expect(zone.isLegalRect(rect4)).toBe(false);
    expect(zone.isLegalRect(rect5)).toBe(true);
  });

  it('should check if two rects overlap', () => {
    const zone = new Zone(game);
    const rect1 = { posX: 1, posY: 1, width: 2, height: 2 };
    const rect2 = { posX: 2, posY: 2, width: 2, height: 2 };
    const rect3 = { posX: 3, posY: 3, width: 2, height: 2 };
    const rect4 = { posX: 2.5, posY: 2.5, width: 2, height: 2 };

    expect(zone.currentRectsOverlap(rect1, rect2, 0)).toBe(true);
    expect(zone.currentRectsOverlap(rect1, rect3, 0)).toBe(false);
    expect(zone.currentRectsOverlap(rect1, rect4, 0)).toBe(true);
    expect(zone.currentRectsOverlap(rect1, rect4, 0.5)).toBe(false);
  });

  it('should check if entity rect has collisions with other objects', () => {
    const zone = new Zone(game);
    const rect1 = { posX: 1, posY: 1, width: 2, height: 2 };
    const entity1 = mockEntity(rect1);
    const rect2 = { posX: 2, posY: 2, width: 2, height: 2 };
    const entity2 = mockEntity(rect2);
    const rect3 = { posX: 3, posY: 3, width: 2, height: 2 };
    const entity3 = mockEntity(rect3);

    zone.updateMatrix(0, rect1, entity1);

    expect(zone.hasCollisionsWithMatrix(rect1, entity1)).toBe(false);
    expect(zone.hasCollisionsWithMatrix(rect2, entity2)).toBe(true);
    expect(zone.hasCollisionsWithMatrix(rect3, entity3)).toBe(false);
  });

  it('should subscribe to entity updates and write them to matrix', () => {
    const zone = new Zone(game);
    const entity1 = mockEntity({ posX: 1, posY: 1, width: 2, height: 2 });
    const entity2 = mockEntity({ posX: 5, posY: 5, width: 2, height: 2 });

    zone.add(entity1);
    zone.add(entity2);

    entity1.emit(EntityEvent.DidUpdate, entity1.getRect());
    entity2.emit(EntityEvent.DidUpdate, entity2.getRect());
    entity2.emit(EntityEvent.ShouldUpdate, entity2.getRect());

    expect(zone.matrix[0][1][1]).toBe(entity1);
    expect(zone.matrix[1][1][1]).toBe(null);
    expect(zone.matrix[0][3][3]).toBe(null);
    expect(zone.matrix[0][5][5]).toBe(null);
  });

  it('should listen to position changes and update its state', () => {
    const zone = new Zone(game);
    const entity = mockEntity({ posX: 1, posY: 1, width: 2, height: 2 });
    const posState = {
      hasCollision: undefined,
      nextRect: { posX: -1, posY: 1, width: 2, height: 2 },
    };

    zone.add(entity);
    entity.spawn();
    entity.emit(EntityEvent.WillHaveNewPos, posState);

    expect(posState.hasCollision).toBe(true);
  });

  it('should listen to entity partial destruction', () => {
    const zone = new Zone(game);
    const entity = new Terrain({ type: 'brickWall', posX: 1, posY: 1, width: 2, height: 2 });

    zone.add(entity);
    entity.spawn();
    entity.emit(EntityEvent.Damaged, { posX: 2, posY: 2, width: 1, height: 1 });

    expect(zone.matrix[0][1][1]).toBe(entity);
    expect(zone.matrix[0][1][2]).toBe(entity);
    expect(zone.matrix[0][2][1]).toBe(entity);
    expect(zone.matrix[0][2][2]).toBe(null);
  });

  it('should subscribe to entity destruction', () => {
    const zone = new Zone(game);
    const entity = mockEntity({ posX: 1, posY: 1, width: 2, height: 2 });

    zone.add(entity);
    entity.spawn();
    entity.emit(EntityEvent.DidUpdate, entity.getRect());
    entity.emit(EntityEvent.ShouldBeDestroyed);

    expect(zone.matrix[0][1][1]).toBe(null);
  });
});
