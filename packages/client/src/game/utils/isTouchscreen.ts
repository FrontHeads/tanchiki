/** Проверяет оснащено ли устройство юзера тачскрином */
export const isTouchscreen = (): boolean => {
  return 'ontouchstart' in window;
};
