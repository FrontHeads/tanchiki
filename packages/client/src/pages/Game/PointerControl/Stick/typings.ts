import { StickDirection } from '../../../../game/services/Controller/KeyBindings';

export type StickProps = {
  size?: number;
  stickSize?: number;
  baseColor?: string;
  stickColor?: string;
  disabled?: boolean;
  throttle?: number;
  sticky?: boolean;
  stickImage?: string;
  baseImage?: string;
  followCursor?: boolean;
  move?: (event: StickUpdateEvent) => void;
  stop?: (event: StickUpdateEvent) => void;
  start?: (event: StickUpdateEvent) => void;
  baseShape?: StickShape;
  stickShape?: StickShape;
  controlPlaneShape?: StickShape;
  minDistance?: number;
};

export type StickDirectionStr = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD';

export type StickUpdateEvent = {
  type: 'move' | 'stop' | 'start';
  x: number | null;
  y: number | null;
  direction: StickDirectionStr | StickDirection | null;
  distance: number | null;
};

export enum StickShape {
  Circle = 'circle',
  Square = 'square',
}

export function isStickDirection(value: unknown): value is StickDirection {
  return typeof value === 'string' ? Object.values(StickDirection).includes(value as StickDirection) : false;
}
