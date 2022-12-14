import { Entity } from '../entities';
import { EventEmitter } from '../utils';
import { SoundPathList } from './Resources/data';
import { resources } from './Resources/Resources';

export class Sound extends EventEmitter {
  add(entity: Entity) {
    // console.log(resources.soundList);
    entity.on('shoot', () => {
      this.playSound('shoot');
    });
    // entity.on('exploding', () => {
    //   this.playSound('enemyExplosion');
    // });
  }

  /** Проигрывает конкретный HTMLAudioElement из Resources.soundList. */
  playSound(sound: keyof typeof SoundPathList): void {
    if (resources.soundList[sound]) {
      resources.soundList[sound].currentTime = 0;
      resources.soundList[sound].play();
      // console.log('Sound : ', resources.soundList[sound]);
    }
  }
}
