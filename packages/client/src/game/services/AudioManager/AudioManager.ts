import { type Entity, Powerup, Tank, Terrain } from '../../entities';
import { type DamageSettings, EntityEvent } from '../../entities/Entity/typings';
import { EventEmitter } from '../../utils';
import { type Game } from '../';
import { type SoundPathList } from '../Resources/data';

export class AudioManager extends EventEmitter {
  private isStopped = false;
  private isMuteKeyPressed = false;
  private isPauseKeyPressed = false;
  /** Хранит все проигрываемые в настоящий момент звуки. */
  public activeSounds: Set<keyof typeof SoundPathList> = new Set();

  constructor(private game: Game) {
    super();

    this.registerGlobalEvents();
  }

  /** Берёт HTMLAudioElement из соответствующего сервиса. */
  getSound(sound: keyof typeof SoundPathList) {
    return this.game.resources.getSound(sound);
  }

  load() {
    this.isStopped = false;
    this.isMuteKeyPressed = false;
    this.isPauseKeyPressed = false;
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
  }

  registerGlobalEvents() {
    this.on('levelIntro', () => {
      this.playSound('levelIntro');
    });

    this.on('gameOver', () => {
      this.pauseSoundAll();
      this.playSound('gameOver');
    });

    // Нужны два одинаковых звука, иначе из-за быстрого проигрывания происходят искажения
    let shouldPlaySecondOne = false;
    this.on('score', () => {
      if (shouldPlaySecondOne) {
        this.playSound('score2');
      } else {
        this.playSound('score');
      }
      shouldPlaySecondOne = !shouldPlaySecondOne;
    });

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
  }

  /** Подписывает звуки на соответствующие события */
  add(entity: Entity) {
    const isTank = entity instanceof Tank;
    const isPlayer = entity.role === 'player';
    const isEnemy = entity.role === 'enemy';
    const isTerrain = entity instanceof Terrain;
    const isPowerup = entity instanceof Powerup;

    /** Звуки танка игрока */
    if (isTank && isPlayer) {
      /** Появление */
      entity.on(EntityEvent.Ready, () => {
        if (entity.moving) {
          this.playSound('move');
        } else {
          this.playSound('idle');
        }
      });

      /** Стрельба */
      entity.on(EntityEvent.Shoot, () => {
        this.playSound('shoot');
      });

      /** Движение */
      entity.on(EntityEvent.Move, () => {
        this.stopSound('idle');
        this.playSound('move');
      });

      /** Остановка */
      entity.on(EntityEvent.Stop, () => {
        this.stopSound('move');
        this.playSound('idle');
      });

      /** Занос на льду */
      entity.on(EntityEvent.Slide, () => {
        this.playSound('ice');
      });

      /** Взрыв игрока */
      entity.on(EntityEvent.Destroyed, () => {
        this.stopSound('move');
        this.stopSound('idle');
        this.playSound('playerExplosion');
      });
    }
    if (isTerrain) {
      if (entity.type === 'brickWall') {
        entity.on(EntityEvent.Damaged, (damageProps: DamageSettings) => {
          if (damageProps.source.role === 'player') {
            this.playSound('hitBrick');
          }
        });
      }
      if (entity.type === 'boundary' || entity.type === 'concreteWall') {
        entity.on(EntityEvent.Damaged, (damageProps: DamageSettings) => {
          if (damageProps.source.role === 'player') {
            this.playSound('hitSteel');
          }
        });
      }
    }

    /** Звуки бонусов */
    if (isPowerup) {
      entity.on(EntityEvent.Spawn, () => {
        this.playSound('powerupAppear');
      });
      entity.on(EntityEvent.Destroyed, () => {
        if (entity.variant === 'TANK') {
          this.playSound('lifePickup');
        } else {
          this.playSound('powerupPickup');
        }
      });
    }

    /** Звуки танка врага */
    if (isTank && isEnemy) {
      /** Попадание во врага */
      entity.on(EntityEvent.Damaged, (damageProps: DamageSettings) => {
        if (!entity.shouldBeDestroyed && damageProps.source.role === 'player') {
          this.playSound('hitEnemy');
        }
      });
      /** Уничтожение врага */
      entity.on(EntityEvent.Destroyed, () => {
        this.playSound('enemyExplosion');
      });
    }
  }

  isPlaying(soundResource: HTMLAudioElement) {
    return soundResource.currentTime >= 0 && !soundResource.paused && !soundResource.ended;
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList) {
    const soundResource = this.getSound(sound);
    if (soundResource && !this.isStopped) {
      if (sound === 'idle' || sound === 'move' || sound === 'ice') {
        soundResource.volume = 0.5;
      }
      soundResource.currentTime = 0;
      soundResource.play().catch(() => {
        /* Чтобы не было ошибок в консоли */
      });
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
    const soundResource = this.getSound(sound);
    if (soundResource && this.isPlaying(soundResource)) {
      soundResource.pause();
      soundResource.currentTime = 0;
      this.activeSounds.delete(sound);
    }
  }

  pauseSound(sound: keyof typeof SoundPathList) {
    const soundResource = this.getSound(sound);
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
    const soundResource = this.getSound(sound);
    if (soundResource && !this.isStopped) {
      soundResource.play().catch(() => {
        /* Чтобы не было ошибок в консоли */
      });
    }
  }

  resumeSoundAll() {
    this.activeSounds.forEach((sound: keyof typeof SoundPathList) => {
      this.resumeSound(sound);
    });
  }
}
