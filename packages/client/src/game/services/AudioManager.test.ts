import { Tank } from '../entities';
import { Rect } from '../typings';
import { AudioManager } from './AudioManager';

function mockEntity(rect: Rect) {
  const tank = new Tank(rect);
  tank.role = 'player';
  return tank;
}

describe('game/services/AudioManager', () => {
  it('should play sounds', () => {
    const audioManager = new AudioManager();

    audioManager.playSound = jest.fn();

    const entity = mockEntity({ posX: 2, posY: 2, width: 2, height: 2 });

    audioManager.add(entity);
    entity.spawn({ posX: 2, posY: 2 });

    entity.shoot();
    expect(entity.spawned).toBeTruthy();

    expect(audioManager.playSound).toHaveBeenNthCalledWith(1, 'idle');
    expect(audioManager.playSound).toHaveBeenNthCalledWith(2, 'shoot');
  });
  it('should play pause sound', () => {
    const audioManager = new AudioManager();

    audioManager.playSound = jest.fn();

    audioManager.emit('pause');

    expect(audioManager.playSound).toHaveBeenCalledWith('pause');
  });
  it('should mute all sounds on pause', () => {
    const audioManager = new AudioManager();

    audioManager.mute = jest.fn();

    audioManager.emit('pause');

    expect(audioManager.mute).toBeCalledTimes(1);

    //** Не смог сделать проверку, что функция playSound не вызывается при паузе */
  });
});
