import { type SoundPathList } from '../Resources/data';

export type ActivatedSounds = Record<keyof typeof SoundPathList, ActiveSound>;

type ActiveSound = {
  audio: AudioBufferSourceNode;
  isPlaying: boolean;
  startTime: number;
  resumeFrom: number;
  isEnded?: boolean;
};
