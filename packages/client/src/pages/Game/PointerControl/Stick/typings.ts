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
  direction: JoystickDirection | null;
  distance: number | null; // Percentile 0-100% of joystick
};

export enum JoystickShape {
  Circle = 'circle',
  Square = 'square',
}
