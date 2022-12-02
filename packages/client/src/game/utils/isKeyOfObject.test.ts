import { isKeyOfObject } from './';

test('isKeyOfObject works properly', () => {
  expect(isKeyOfObject('key', { key: 1 })).toBe(true);
  expect(isKeyOfObject(0, [1])).toBe(true);
  expect(isKeyOfObject('key', { wrongkey: 1 })).toBe(false);
  expect(isKeyOfObject('key', 'not object')).toBe(false);
});
