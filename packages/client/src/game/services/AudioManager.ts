import { Entity, Tank, Terrain } from '../entities';
import { EventEmitter } from '../utils';
import { DamageSettings, EntityEvent } from '../typings/';
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
        this.pauseSoundAll();
        if (!this.isMuteKeyPressed) {
          this.playSound('pause');
        }
        this.isStopped = true;
      } else {
        this.isStopped = false;
        this.playSound('pause');
        this.resumeSoundAll();
      }
    });

    this.on('levelIntro', () => {
      this.playSound('levelIntro');
    });
    this.on('gameOver', () => {
      this.pauseSoundAll();
      this.playSound('gameOver');
    });
  }

  load() {
    this.reset();
  }

  unload() {
    this.reset();
  }

  /** Останавливает все HTMLAudioElement из AudioManager.activeSounds */
  reset() {
    this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
      this.stopSound(sound);
    });
    this.isStopped = false;
    this.isMuteKeyPressed = false;
    this.isPauseKeyPressed = false;
  }

  /** Подписывает звуки на соответствующие события */
  add(entity: Entity) {
    const isTank = entity instanceof Tank;
    const isPlayer = entity.role === 'player';
    const isEnemy = entity.role === 'enemy';
    const isTerrain = entity instanceof Terrain;
    /** Звуки танка игрока */
    if (isTank && isPlayer) {
      /**появление */
      entity.on(EntityEvent.READY, () => {
        if (entity.moving) {
          this.playSound('move');
        } else {
          this.playSound('idle');
        }
      });
      /**стрельба */
      entity.on(EntityEvent.SHOOT, () => {
        this.playSound('shoot');
      });
      /**движение */
      entity.on(EntityEvent.MOVE, () => {
        this.stopSound('idle');
        this.playSound('move');
      });
      /**остановка */
      entity.on(EntityEvent.STOP, () => {
        this.stopSound('move');
        this.playSound('idle');
      });
      /**взрыв игрока */
      entity.on(EntityEvent.DESTROYED, () => {
        this.stopSound('move');
        this.stopSound('idle');
        this.playSound('playerExplosion');
      });
    } else if (isTerrain) {
      if (entity.type === 'brickWall') {
        entity.on(EntityEvent.DAMAGED, (damageProps: DamageSettings) => {
          if (damageProps.source.role === 'player') {
            this.playSound('hitBrick');
          }
        });
      }
      if (entity.type === 'boundary' || entity.type === 'concreteWall') {
        entity.on(EntityEvent.DAMAGED, (damageProps: DamageSettings) => {
          if (damageProps.source.role === 'player') {
            this.playSound('hitSteel');
          }
        });
      }
    }

    /** Звуки танка врага */
    if (isTank && isEnemy) {
      /**взрыв врага */
      entity.on(EntityEvent.DESTROYED, () => {
        this.playSound('enemyExplosion');
      });
    }
  }

  isPlaying(soundResource: HTMLAudioElement) {
    return soundResource.currentTime > 0 && !soundResource.paused && !soundResource.ended;
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList) {
    const soundResource = resources.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.currentTime = 0;
      soundResource.play();
      this.activeSounds.add(sound);
      soundResource.addEventListener('ended', () => {
        if (sound === 'idle' || sound === 'move') {
          this.playSound(sound);
        } else {
          this.activeSounds.delete(sound);
        }
      });
    }
  }

  /** Останавливает конкретный HTMLAudioElement из Resources.soundList. */
  stopSound(sound: keyof typeof SoundPathList) {
    const soundResource = resources.getSound(sound);
    if (soundResource && this.isPlaying(soundResource)) {
      soundResource.pause();
      soundResource.currentTime = 0;
      this.activeSounds.delete(sound);
    }
  }

  pauseSound(sound: keyof typeof SoundPathList) {
    const soundResource = resources.getSound(sound);
    if (!this.isStopped && soundResource && this.isPlaying(soundResource)) {
      soundResource.pause();
    }
  }

  pauseSoundAll() {
    this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
      this.pauseSound(sound);
    });
  }

  resumeSound(sound: keyof typeof SoundPathList) {
    const soundResource = resources.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.play();
    }
  }

  resumeSoundAll() {
    this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
      this.resumeSound(sound);
    });
  }
}
