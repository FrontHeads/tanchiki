import { Entity } from '../entities';
import type { RectT } from '../typings';
import { EventBus } from '../utils';
import { View } from './';

function mockEntity(rect: RectT) {
  const entity = new EventBus() as Entity;
  Object.assign(entity, rect);
  entity.alignedToGrid = true;
  entity.lastRect = rect;
  entity.getRect = () => rect;
  entity.nextRect = rect;
  return entity;
}

describe('game/services/View', () => {
  it('should create layers', () => {
    const view = new View({ width: 10, height: 10 }, document.body);

    expect(document.querySelector('canvas')).not.toBe(null);
  });

  it('should bind entities to layers', () => {
    const view = new View({ width: 10, height: 10 }, null);
    const entity = { on: () => null } as unknown as Entity;

    view.bindEntityToLayer(entity, 'tanks');

    expect(view.layers['tanks'].entities.has(entity)).toBe(true);
  });

  it('should remove entities from layers', () => {
    const view = new View({ width: 10, height: 10 }, null);
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.bindEntityToLayer(entity, 'tanks');
    view.removeEntityFromLayer(entity, 'tanks');

    expect(view.layers['tanks'].entities.has(entity)).toBe(false);
  });

  it('should calculate entity rect in pixels', () => {
    const view = new View({ width: 10, height: 10 }, null);
    view.pixelRatio = 10;
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    const rect = view.getEntityActualRect(entity);

    expect(rect).toEqual([20, 20, 20, 20]);
  });
});
