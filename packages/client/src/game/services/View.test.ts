import { Entity, Tank } from '../entities';
import { Direction, Rect } from '../typings';
import { EventEmitter } from '../utils';
import { sleep } from '../utils/sleepTimer';
import { EntityEvent } from './../typings/index';
import { Game, View } from './';

class TestEntity extends EventEmitter {}

function mockEntity(rect: Rect) {
  const entity = new TestEntity() as Entity;
  entity.type = 'tank';
  entity.spawned = true;
  Object.assign(entity, rect);
  return entity;
}

describe('game/services/View', () => {
  it('should create layers', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));

    view.build(root);

    expect(view.root).toBe(root);
    expect(Object.keys(view.layers).length).not.toBe(0);
    expect(document.querySelector('canvas')).not.toBe(null);
  });

  it('should bind entities to layers and subscribe to the updates', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));

    view.build(root);

    view.drawOnLayer = jest.fn();
    view.eraseFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.add(entity);
    entity.emit(EntityEvent.SHOULD_UPDATE);
    entity.emit(EntityEvent.DID_UPDATE);

    expect(view.eraseFromLayer).toHaveBeenCalledTimes(1);
    expect(view.drawOnLayer).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to entity destruction', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));
    view.drawOnLayer = jest.fn();
    view.eraseFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.build(root);
    view.add(entity);
    const layerObjectsCount1 = Array.from(view.layers['tanks'].entities).length;
    entity.emit(EntityEvent.SHOULD_BE_DESTROYED);
    entity.emit(EntityEvent.DID_UPDATE);
    const layerObjectsCount2 = Array.from(view.layers['tanks'].entities).length;

    expect(layerObjectsCount1).not.toBe(layerObjectsCount2);
    expect(view.eraseFromLayer).toHaveBeenCalled();
    expect(view.drawOnLayer).not.toHaveBeenCalled();
  });

  it('should calculate entity rect in pixels', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));
    view.pixelRatio = 10;
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.build(root);
    const rect = view.getActualRect(entity);

    expect(rect).toEqual([22, 22, 16, 16]);
  });

  it('animation should work. Checking the call of all animation methods in View.', async () => {
    const root = document.body.appendChild(document.createElement('div'));
    const game = Game.create();
    game.loop.start();
    game.view.spriteImg = new Image();
    game.view.build(root);

    const eraseFromLayerSpy = jest.spyOn(game.view, 'eraseFromLayer');
    const drawOnLayerSpy = jest.spyOn(game.view, 'drawOnLayer');
    const getSpriteCoordinatesSpy = jest.spyOn(game.view, 'getSpriteCoordinates');
    const drawMainEntitySpriteSpy = jest.spyOn(game.view, 'drawMainEntitySprite');
    const setNextSpriteFrameSpy = jest.spyOn(game.view, 'setNextSpriteFrame').mockImplementation();

    const tank = new Tank({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.DOWN });
    const startAnimationSpy = jest.spyOn(tank, 'startAnimation');
    game.addEntity(tank);
    tank.spawn({ posX: 1, posY: 1 });

    await sleep(200);

    expect(startAnimationSpy).toHaveBeenCalled();
    expect(eraseFromLayerSpy).toHaveBeenCalled();
    expect(drawOnLayerSpy).toHaveBeenCalled();
    expect(getSpriteCoordinatesSpy).toHaveBeenCalled();
    expect(drawMainEntitySpriteSpy).toHaveBeenCalled();
    // Если метод отработал более 1 раза, значит фреймы анимации менялись минимум 2 раза. Значит анимация работает.
    expect(setNextSpriteFrameSpy.mock.calls.length).toBeGreaterThan(1);
  });
});
