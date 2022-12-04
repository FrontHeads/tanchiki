export function isKeyOfObject(key: unknown, obj: unknown): key is keyof typeof obj {
  if (typeof obj !== 'object' || obj === null) return false;
  if (typeof key !== 'string' && typeof key !== 'number') return false;
  if (key in obj && typeof obj[key as keyof typeof obj] !== 'undefined') {
    return true;
  }
  return false;
}
