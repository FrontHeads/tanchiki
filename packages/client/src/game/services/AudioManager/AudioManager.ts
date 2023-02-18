import { type Entity, Powerup, Tank, Terrain } from '../../entities';
import { type DamageSettings, EntityEvent } from '../../entities/Entity/typings';
import { EventEmitter } from '../../utils';
import { type Game } from '../';
import { SoundPathList } from '../Resources/data';
import { type ActivatedSounds } from './typings';

export class AudioManager extends EventEmitter {
  private isStopped = false;
  private isMuteKeyPressed = false;
  private isPauseKeyPressed = false;
  context: AudioContext;
  /** Хранит все проигрываемые звуки. */
  activatedSounds: ActivatedSounds = {} as ActivatedSounds;

  constructor(private game: Game) {
    super();

    this.registerGlobalEvents();
    this.context = this.game.resources.audioContext;
  }

  /** Берёт AudioElement из соответствующего сервиса. */
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

  /** Останавливает все AudioElement из AudioManager.activeSounds */
  reset() {
    this.pauseSoundAll();
    this.activatedSounds = {} as ActivatedSounds;
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

  /** Проигрывает конкретный AudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList, resumeTime = 0) {
    if (this.isStopped) {
      return;
    }

    if (this.activatedSounds[sound]?.isPlaying) {
      this.stopSound(sound);
    }

    /**  Получаем звук из списка ресурсов. */
    const audio = this.context.createBufferSource();
    audio.buffer = this.getSound(sound);

    /**  Закцикливаем звук, если нужно. */
    const isLoopedSound = 'idle' || sound === 'move';
    audio.loop = sound === isLoopedSound ? true : false;

    /**  Регулировка громкости звука. */
    const gainNode = this.context.createGain();
    const islowVolumeSound = sound === 'idle' || sound === 'move' || sound === 'ice';
    gainNode.gain.value = islowVolumeSound ? 0.4 : 1;

    /**  Подключаем звук к выходу с учетом громкости. */
    audio.connect(gainNode);
    gainNode.connect(this.context.destination);

    /**  Запускаем воспроизведение звука */
    audio.start(0, resumeTime);

    /** Web Audio API не хранит данных о состоянии звука, поэтому мы должны это делать самостоятельно. */
    this.activatedSounds[sound] = {
      audio,
      isPlaying: true,
      startTime: this.context.currentTime - (this.activatedSounds[sound]?.resumeFrom ?? 0),
      resumeFrom: 0,
    };

    audio.onended = () => {
      if (!this.isStopped && this.activatedSounds[sound]) {
        this.activatedSounds[sound].isEnded = true;
      }
    };
  }

  /** Останавливает конкретный AudioElement из Resources.soundList. */
  stopSound(sound: keyof typeof SoundPathList) {
    const soundResource = this.activatedSounds[sound];

    if (soundResource?.isPlaying) {
      soundResource.audio.stop();
      soundResource.isPlaying = false;
      soundResource.resumeFrom = this.context.currentTime - soundResource.startTime;
    }
  }

  pauseSound(sound: keyof typeof SoundPathList) {
    const soundResource = this.activatedSounds[sound];

    if (!this.isStopped && soundResource.isPlaying) {
      this.stopSound(sound);
    }
  }

  pauseSoundAll() {
    Object.keys(this.activatedSounds).forEach(soundName => {
      if (soundName in SoundPathList) {
        this.pauseSound(soundName as keyof typeof SoundPathList);
      }
    });
  }

  resumeSound(sound: keyof typeof SoundPathList) {
    const soundResource = this.activatedSounds[sound];

    if (!this.isStopped && !soundResource.isPlaying && !soundResource.isEnded) {
      this.playSound(sound, soundResource.resumeFrom);
    }
  }

  resumeSoundAll() {
    Object.keys(this.activatedSounds).forEach(soundName => {
      if (soundName in SoundPathList) {
        this.resumeSound(soundName as keyof typeof SoundPathList);
      }
    });
  }
}
