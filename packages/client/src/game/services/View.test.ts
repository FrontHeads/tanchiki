import { Entity } from '../entities';
import type { RectT } from '../typings';
import { EventBus } from '../utils';
import { View } from './';

function mockEntity(rect: RectT) {
  const entity = new EventBus() as Entity;
  Object.assign(entity, rect);
  return entity;
}

describe('game/services/View', () => {
  it('should create layers', () => {
    const view = new View({ width: 10, height: 10 }, document.body);

    expect(document.querySelector('canvas')).not.toBe(null);
  });

  it('should bind entities to layers and subscribe to the updates', () => {
    const view = new View({ width: 10, height: 10 }, null);
    view.drawEntityOnLayer = jest.fn();
    view.eraseEntityFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.bindEntityToLayer(entity, 'tanks');
    entity.emit('entityShouldUpdate');
    entity.emit('entityDidUpdate');

    expect(view.layers['tanks'].entities.has(entity)).toBe(true);
    expect(view.eraseEntityFromLayer).toHaveBeenCalledTimes(1);
    expect(view.drawEntityOnLayer).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to entity destruction', () => {
    const view = new View({ width: 10, height: 10 }, null);
    view.eraseEntityFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.bindEntityToLayer(entity, 'tanks');
    entity.emit('entityShouldBeDestroyed');

    expect(view.layers['tanks'].entities.has(entity)).toBe(false);
    expect(view.eraseEntityFromLayer).toHaveBeenCalled();
  });

  it('should calculate entity rect in pixels', () => {
    const view = new View({ width: 10, height: 10 }, null);
    view.pixelRatio = 10;
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    const rect = view.getEntityActualRect(entity);

    expect(rect).toEqual([20, 20, 20, 20]);
  });
});
