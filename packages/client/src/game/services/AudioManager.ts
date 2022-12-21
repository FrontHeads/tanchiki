import { Entity, Tank } from '../entities';
import { EventEmitter } from '../utils';
import { SoundPathList } from './Resources/data';
import { resources } from './Resources/Resources';

export class AudioManager extends EventEmitter {
  private isStopped = false;
  private isMuteKeyPressed = false;
  private isPauseKeyPressed = false;
  /** Хранит все проигрываемые в настоящий момент звуки. */
  public activeSounds: Set<keyof typeof SoundPathList> = new Set();

  constructor() {
    super();

    this.on('pause', ({ isMuteKey = false }) => {
      if (isMuteKey) {
        this.isMuteKeyPressed = !this.isMuteKeyPressed;
      } else {
        this.isPauseKeyPressed = !this.isPauseKeyPressed;
      }

      // Если mute-режим активирован - кнопка паузы не активна в плане звука.
      // Если пауза активирована - кнопка mute не активна.
      if ((this.isMuteKeyPressed && !isMuteKey) || (this.isPauseKeyPressed && isMuteKey)) {
        return;
      }

      if (!this.isStopped) {
        this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
          this.pauseSound(sound);
        });
        if (!this.isMuteKeyPressed) {
          this.playSound('pause');
        }
        this.isStopped = true;
      } else {
        this.isStopped = false;
        this.playSound('pause');
        this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
          this.resumeSound(sound);
        });
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
    const soundResource = resources.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.currentTime = 0;
      soundResource.play();
      soundResource.addEventListener('ended', () => {
        this.activeSounds.delete(sound);
      });

      this.activeSounds.add(sound);
    }
  }

  pauseSound(sound: keyof typeof SoundPathList): void {
    const soundResource = resources.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.pause();
    }
  }

  resumeSound(sound: keyof typeof SoundPathList): void {
    const soundResource = resources.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.play();
    }
  }

  /** Останавливает конкретный HTMLAudioElement из Resources.soundList. */
  stopSound(sound: keyof typeof SoundPathList): void {
    const soundResource = resources.getSound(sound);
    if (soundResource) {
      soundResource.pause();
      soundResource.currentTime = 0;
      this.activeSounds.delete(sound);
    }
  }

  /** Останавливает все HTMLAudioElement из AudioManager.activeSounds */
  reset(): void {
    this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
      this.stopSound(sound);
    });
  }
}
