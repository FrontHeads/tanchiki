import { buildPath } from '../utils/build-path';

const baseUrl = 'http://localhost/';

describe('BuildPath util', () => {
  test('should replace multiple slashes with one', () => {
    expect(buildPath(baseUrl, '//users')).toEqual(`${baseUrl}users`);
  });

  test('should add slashes if needed', () => {
    expect(buildPath(baseUrl, '/users', '1')).toEqual(`${baseUrl}users/1`);
  });
});
