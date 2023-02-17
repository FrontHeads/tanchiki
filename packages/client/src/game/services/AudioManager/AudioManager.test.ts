import { Tank } from '../../entities';
import { type Rect } from '../../entities/Entity/typings';
import { type Game } from '../';
import { AudioManager } from './AudioManager';

function mockEntity(rect: Rect) {
  const tank = new Tank(rect);
  tank.role = 'player';
  return tank;
}

describe('game/services/AudioManager', () => {
  it('should play sounds', () => {
    const audioManager = new AudioManager({} as Game);

    audioManager.playSound = jest.fn();

    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    audioManager.add(entity);
    entity.spawn({ posX: 2, posY: 2 });
    // По умолчанию у танка стоит false в течение 1 сек после спауна, пока работает анимация.
    entity.canShoot = true;
    entity.frozen = false;

    entity.shoot();
    entity.update();

    expect(audioManager.playSound).toHaveBeenNthCalledWith(1, 'shoot');
  });

  it('should play pause sound', () => {
    const audioManager = new AudioManager({} as Game);

    audioManager.playSound = jest.fn();

    audioManager.emit('pause', { isMuteKey: false });

    expect(audioManager.playSound).toHaveBeenCalledWith('pause');
  });

  it('should not play sounds while paused', () => {
    const audioManager = new AudioManager({} as Game);

    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    audioManager.add(entity);
    entity.spawn({ posX: 2, posY: 2 });

    entity.shoot();
    entity.update();

    expect(entity.spawned).toBeTruthy();
    expect(audioManager.activeSounds.has('shoot')).toBeFalsy();
  });
});
