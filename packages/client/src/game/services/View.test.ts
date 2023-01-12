import { type Entity, TankPlayer } from '../entities';
import { type Rect, Direction } from '../typings';
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

    view.load(root);

    expect(view.root).toBe(root);
    expect(Object.keys(view.layers).length).not.toBe(0);
    expect(document.querySelector('canvas')).not.toBe(null);
  });

  it('should bind entities to layers and subscribe to the updates', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));

    view.load(root);

    view.drawOnLayer = jest.fn();
    view.eraseFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.add(entity);
    entity.emit(EntityEvent.ShouldUpdate);
    entity.emit(EntityEvent.DidUpdate);

    expect(view.eraseFromLayer).toHaveBeenCalledTimes(1);
    expect(view.drawOnLayer).toHaveBeenCalledTimes(1);
  });

  it('should subscribe to entity destruction', () => {
    const view = new View({ width: 10, height: 10 });
    const root = document.body.appendChild(document.createElement('div'));
    view.drawOnLayer = jest.fn();
    view.eraseFromLayer = jest.fn();
    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    view.load(root);
    view.add(entity);
    const layerObjectsCount1 = Array.from(view.layers['tanks'].entities).length;
    entity.emit(EntityEvent.ShouldBeDestroyed);
    entity.emit(EntityEvent.DidUpdate);
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

    view.load(root);
    const rect = view.getActualRect(entity);

    expect(rect).toEqual([22, 22, 16, 16]);
  });

  it('should have animations (checking the call of all animation methods)', async () => {
    const root = document.body.appendChild(document.createElement('div'));
    const game = Game.create();
    game.view.spriteImg = new Image();
    game.view.isSpriteImgLoaded = () => true;
    game.view.load(root);
    game.loop.start();

    const eraseFromLayerSpy = jest.spyOn(game.view, 'eraseFromLayer');
    const drawOnLayerSpy = jest.spyOn(game.view, 'drawOnLayer');
    const getSpriteCoordinatesSpy = jest.spyOn(game.view, 'getSpriteCoordinates');
    const drawMainEntitySpriteSpy = jest.spyOn(game.view, 'drawMainEntitySprite');
    const setNextSpriteFrameSpy = jest.spyOn(game.view, 'setNextSpriteFrame').mockImplementation();

    const tank = new TankPlayer({ posX: 2, posY: 2, width: 2, height: 2, direction: Direction.Down });
    const startAnimationSpy = jest.spyOn(tank, 'startAnimation');
    game.addEntity(tank);
    tank.spawn({ posX: 1, posY: 1 });

    await sleep(300);

    expect(startAnimationSpy).toHaveBeenCalled();
    expect(eraseFromLayerSpy).toHaveBeenCalled();
    expect(drawOnLayerSpy).toHaveBeenCalled();
    expect(getSpriteCoordinatesSpy).toHaveBeenCalled();
    expect(drawMainEntitySpriteSpy).toHaveBeenCalled();
    // Если метод отработал более 1 раза, значит фреймы анимации менялись минимум 2 раза. Значит анимация работает.
    expect(setNextSpriteFrameSpy.mock.calls.length).toBeGreaterThan(1);
  });
});
