import { Entity } from '../entities';
import { Rect } from '../typings';
import { EventEmitter } from '../utils';
import { AudioManager } from './AudioManager';

function mockEntity(rect: Rect) {
  const entity = new EventEmitter() as Entity;
  entity.type = 'tank';
  Object.assign(entity, rect);
  return entity;
}

describe('game/services/AudioManager', () => {
  it('should play and stop sounds', () => {
    const audioManager = new AudioManager();

    audioManager.playSound = jest.fn();
    audioManager.stopSound = jest.fn();

    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    audioManager.add(entity);

    entity.on('move', () => {
      audioManager.stopSound('idle');
      audioManager.playSound('move');
    });

    entity.on('stop', () => {
      audioManager.stopSound('move');
      audioManager.playSound('idle');
    });

    entity.emit('move');
    entity.emit('stop');

    expect(audioManager.playSound).toHaveBeenCalledTimes(2);
    expect(audioManager.stopSound).toHaveBeenCalledTimes(2);
  });
});
