export const isTouchscreen = (): boolean => {
  return 'ontouchstart' in window;
};
