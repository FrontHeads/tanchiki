import { SoundPathList } from '../Resources/data';

export type ActivatedSounds = Record<keyof typeof SoundPathList, ActiveSound>;

type ActiveSound = {
  audio: AudioBufferSourceNode;
  isPlaying: boolean;
  startTime: number;
  resumeFrom: number;
  isEnded?: boolean;
};

export function isSoundNameInSoundPathList(soundName: string): soundName is keyof typeof SoundPathList {
  return soundName in SoundPathList;
}
