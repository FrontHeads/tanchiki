import { StickDirection } from '../../../../game/services/Controller/KeyBindings';

export type IJoystickProps = {
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
  move?: (event: IJoystickUpdateEvent) => void;
  stop?: (event: IJoystickUpdateEvent) => void;
  start?: (event: IJoystickUpdateEvent) => void;
  baseShape?: JoystickShape;
  stickShape?: JoystickShape;
  controlPlaneShape?: JoystickShape;
  minDistance?: number;
};

export type JoystickDirection = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD';

export type IJoystickUpdateEvent = {
  type: 'move' | 'stop' | 'start';
  x: number | null;
  y: number | null;
  direction: JoystickDirection | StickDirection | null;
  distance: number | null; // Percentile 0-100% of joystick
};

export enum JoystickShape {
  Circle = 'circle',
  Square = 'square',
}

export function isStickDirection(value: unknown): value is StickDirection {
  return typeof value === 'string' ? Object.values(StickDirection).includes(value as StickDirection) : false;
}
