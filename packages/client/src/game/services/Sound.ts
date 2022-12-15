import { Entity, Tank } from '../entities';
import { EventEmitter } from '../utils';
import { SoundPathList } from './Resources/data';
import { resources } from './Resources/Resources';

export class Sound extends EventEmitter {
  /** Подписывает звуки на  соответствующие события */
  add(entity: Entity) {
    const isTank = entity instanceof Tank;
    const isPlayer = entity.role === 'player';
    const isEnemy = entity.role === 'enemy';

    /** Звуки танка игрока */
    if (isTank && isPlayer) {
      /**стрельба */
      entity.on('shoot', () => {
        this.playSound('shoot');
      });
      /**движение */
      entity.on('move', () => {
        this.playSound('move');
      });
      /**остановка */
      entity.on('stop', () => {
        this.stopSound('move');
        this.playSound('idle');
      });
    }

    /** Звуки танка врага */
    if (isTank && isEnemy) {
      /**получение урона */
      entity.on('damaged', () => {
        this.playSound('hitEnemy');
      });
      /**взрыв врага */
      entity.on('destroyed', () => {
        this.playSound('enemyExplosion');
      });
    }

    /**пауза */

    entity.on('pause', () => {
      this.playSound('pause');
    });
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList): void {
    if (resources.soundList[sound]) {
      resources.soundList[sound].currentTime = 0;
      resources.soundList[sound].play();
    }
  }

  /** Останавливает конкретный HTMLAudioElement из Resources.soundList. */
  stopSound(sound: keyof typeof SoundPathList): void {
    if (resources.soundList[sound]) {
      resources.soundList[sound].pause();
      resources.soundList[sound].currentTime = 0;
    }
  }
}
