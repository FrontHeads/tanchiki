import { Entity } from '../entities';
import type { Rect } from '../typings';
import { EventEmitter } from '../utils';
import { View } from './';

function mockEntity(rect: Rect) {
  const entity = new EventEmitter() as Entity;
  Object.assign(entity, rect);
  return entity;
}

describe('game/services/View', () => {
  it('should create layers', () => {
    const view = new View({ width: 10, height: 10, root: document.body });

    expect(view.root).toBe(document.body);
    expect(Object.keys(view.layers).length).not.toBe(0);
    expect(document.querySelector('canvas')).not.toBe(null);
  });

  it('should bind entities to layers and subscribe to the updates', () => {
    const view = new View({ width: 10, height: 10, root: document.body });
    view.drawEntityOnLayer = jest.fn();
    view.eraseEntityFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.bindEntityToLayer(entity, 'tanks');
    entity.emit('entityShouldUpdate');
    entity.emit('entityDidUpdate');

    expect(view.eraseEntityFromLayer).toHaveBeenCalledTimes(1);
    expect(view.drawEntityOnLayer).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to entity destruction', () => {
    const view = new View({ width: 10, height: 10, root: document.body });
    view.drawEntityOnLayer = jest.fn();
    view.eraseEntityFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.bindEntityToLayer(entity, 'tanks');
    const layerObjectsCount1 = Array.from(view.layers['tanks'].objects).length;
    entity.emit('entityShouldBeDestroyed');
    entity.emit('entityDidUpdate');
    const layerObjectsCount2 = Array.from(view.layers['tanks'].objects).length;

    expect(layerObjectsCount1).not.toBe(layerObjectsCount2);
    expect(view.eraseEntityFromLayer).toHaveBeenCalled();
    expect(view.drawEntityOnLayer).not.toHaveBeenCalled();
  });

  it('should calculate entity rect in pixels', () => {
    const view = new View({ width: 10, height: 10, root: document.body });
    view.pixelRatio = 10;
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    const rect = view.getEntityActualRect(entity);

    expect(rect).toEqual([20, 20, 20, 20]);
  });
});
