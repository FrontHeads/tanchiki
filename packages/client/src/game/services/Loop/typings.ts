export type LoopDelays = Record<number, Array<() => void>>;

export type LoopIntervals = Record<string, LoopInterval>;

export type LoopInterval = {
  loopCounter: number;
  targetLoop: number;
  callback: () => void;
};
