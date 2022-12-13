import { rand } from './';

describe('rand', () => {
  test('rand works properly', () => {
    expect(rand(1, 2)).toBeGreaterThan(0);
    expect(rand(1, 2)).toBeLessThan(3);
    expect(rand(4, 5)).toBeGreaterThan(3);
    expect(rand(4, 5)).toBeLessThan(6);
    expect(rand(8, 9)).toBeGreaterThan(7);
    expect(rand(8, 9)).toBeLessThan(10);
  });
});
