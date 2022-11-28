import type {Entity} from '../entities';
import type {RectT} from '../typings';
import {EventBus} from '../utils';
import {Zone} from './';

function entityMock(rect: RectT) {
  const entity = new EventBus() as Entity;
  Object.assign(entity, rect);
  entity.alignedToGrid = true;
  entity.lastRect = rect;
  entity.getRect = () => rect;
  entity.nextRect = rect;
  return entity;
}

describe('game/services/Zone', () => {
  it('should build matrix on init', () => {
    const zone = new Zone({width: 100, height: 100});

    expect(zone.matrix.length).toBe(100);
    expect(zone.matrix[99].length).toBe(100);
    expect(zone.matrix[0][0]).toBe(null);
    expect(zone.matrix[99][99]).toBe(null);
    expect(zone.matrix[99][100]).toBe(undefined);
  });

  it('should update matrix', () => {
    const zone = new Zone({width: 10, height: 10});
    const rect = {posX: 1, posY: 1, width: 2, height: 2};
    const entity = {} as Entity;
  
    zone.updateMatrix(rect, entity);
  
    expect(zone.matrix[1][1]).toBe(entity);
    expect(zone.matrix[1][2]).toBe(entity);
    expect(zone.matrix[2][1]).toBe(entity);
    expect(zone.matrix[2][2]).toBe(entity);
    expect(zone.matrix[1][0]).toBe(null);
    expect(zone.matrix[2][3]).toBe(null);
  });

  it('should check if entity rect is beyond matrix', () => {
    const zone = new Zone({width: 10, height: 10});
    const rect1 = {posX: -1, posY: -1, width: 1, height: 1};
    const rect2 = {posX: 1, posY: 1, width: 1, height: 1};
    const rect3 = {posX: 1, posY: 1, width: 10, height: 1};
    const rect4 = {posX: 1, posY: 10, width: 1, height: 1};

    expect(zone.isBeyondMatrix(rect1)).toBe(true);
    expect(zone.isBeyondMatrix(rect2)).toBe(false);
    expect(zone.isBeyondMatrix(rect3)).toBe(true);
    expect(zone.isBeyondMatrix(rect4)).toBe(true);
  });

  it('should check if entity rect has collisions with other objects', () => {
    const zone = new Zone({width: 10, height: 10});
    const rect1 = {posX: 1, posY: 1, width: 2, height: 2};
    const entity1 = {} as Entity;
    const rect2 = {posX: 2, posY: 2, width: 2, height: 2};
    const entity2 = {} as Entity;
    const rect3 = {posX: 3, posY: 3, width: 2, height: 2};
    const entity3 = {} as Entity;

    zone.updateMatrix(rect1, entity1);

    expect(zone.hasCollisionsWithMatrix(rect1, entity1)).toBe(false);
    expect(zone.hasCollisionsWithMatrix(rect2, entity2)).toBe(true);
    expect(zone.hasCollisionsWithMatrix(rect3, entity3)).toBe(false);
  });

  it('should subscribe to entity updates and write them to matrix', () => {
    const zone = new Zone({width: 10, height: 10});
    const entity1 = entityMock({posX: 1, posY: 1, width: 2, height: 2});
    const entity2 = entityMock({posX: 5, posY: 5, width: 2, height: 2});

    zone.registerEntity(entity1);
    zone.registerEntity(entity2);

    entity1.emit('entityDidUpdate', entity1.getRect());
    entity2.emit('entityDidUpdate', entity2.getRect());
    entity2.emit('entityShouldUpdate', entity2.getRect());

    expect(zone.matrix[1][1]).toBe(entity1);
    expect(zone.matrix[3][3]).toBe(null);
    expect(zone.matrix[5][5]).toBe(null);
  });

  it('should listen to position changes and update its state', () => {
    const zone = new Zone({width: 10, height: 10});
    const entity = entityMock({posX: 1, posY: 1, width: 2, height: 2});
    entity.nextRect = {posX: -1, posY: 1, width: 2, height: 2};
    const posState = {hasCollision: false};

    zone.registerEntity(entity);
    entity.emit('entityWillHaveNewPos', posState);

    expect(posState.hasCollision).toBe(true);
  });

  it('should subscribe to entity destruction', () => {
    const zone = new Zone({width: 10, height: 10});
    const entity1 = entityMock({posX: 1, posY: 1, width: 2, height: 2});

    zone.registerEntity(entity1);
    entity1.emit('entityDidUpdate', entity1.getRect());
    entity1.emit('entityShouldBeDestroyed');

    expect(zone.matrix[1][1]).toBe(null);
  });
});
