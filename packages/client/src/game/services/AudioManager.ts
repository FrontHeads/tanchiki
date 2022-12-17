import { Entity, Tank } from '../entities';
import { EventEmitter } from '../utils';
import { SoundPathList } from './Resources/data';
import { resources } from './Resources/Resources';

export class AudioManager extends EventEmitter {
  private isMuted = false;

  constructor() {
    super();

    this.on('pause', () => {
      if (!this.isMuted) {
        this.playSound('pause');
        this.mute();
      } else {
        this.unMute();
        this.playSound('pause');
      }
    });

    this.on('levelIntro', () => {
      this.playSound('levelIntro');
    });
  }
  /** Подписывает звуки на  соответствующие события */
  add(entity: Entity) {
    const isTank = entity instanceof Tank;
    const isPlayer = entity.role === 'player';
    const isEnemy = entity.role === 'enemy';
    /** Звуки танка игрока */
    if (isTank && isPlayer) {
      /**появление */
      entity.on('spawn', () => {
        this.playSound('idle');
      });
      /**стрельба */
      entity.on('shoot', () => {
        this.playSound('shoot');
      });
      /**движение */
      entity.on('move', () => {
        this.stopSound('idle');
        this.playSound('move');
      });
      /**остановка */
      entity.on('stop', () => {
        this.stopSound('move');
        this.playSound('idle');
      });
      /**взрыв игрока */
      entity.on('destroyed', () => {
        this.playSound('playerExplosion');
      });
    }

    /** Звуки танка врага */
    if (isTank && isEnemy) {
      /**взрыв врага */
      entity.on('destroyed', () => {
        this.playSound('enemyExplosion');
      });
    }
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList): void {
    if (resources.getSound(sound) && !this.isMuted) {
      resources.getSound(sound).currentTime = 0;
      resources.getSound(sound).play();
    }
  }

  /** Останавливает конкретный HTMLAudioElement из Resources.soundList. */
  stopSound(sound: keyof typeof SoundPathList): void {
    if (resources.getSound(sound)) {
      resources.getSound(sound).pause();
      resources.getSound(sound).currentTime = 0;
    }
  }

  mute() {
    this.isMuted = true;
  }

  unMute() {
    this.isMuted = false;
  }
}
