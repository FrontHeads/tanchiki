import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { buildPath } from './build-path';
import { Http } from './Http';

const mock = new MockAdapter(axios);
const baseUrl = 'http://localhost:1234';
const data = { response: true };

describe('Request util', () => {
  test('returns correct data when get request is sent', done => {
    mock.onGet(buildPath(baseUrl, '/users')).reply(200, data);

    Http.get('/users', { baseUrl, params: { page: 2 } }).then(response => {
      expect(response.data).toEqual(data);
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('returns correct data when post request is sent', done => {
    mock.onPost(buildPath(baseUrl, '/users')).reply(200, data);

    Http.post('/users', { baseUrl, data: { name: 'Vasya' } }).then(response => {
      expect(response.data).toEqual(data);
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('returns correct data when put request is sent', done => {
    mock.onPut(buildPath(baseUrl, '/users')).reply(200, data);

    Http.put('/users', { baseUrl, data: { name: 'Kolya' } }).then(response => {
      expect(response.data).toEqual(data);
      expect(response.status).toEqual(200);
      done();
    });
  });

  test('returns correct data when delete request is sent', done => {
    mock.onDelete(buildPath(baseUrl, '/users/1')).reply(201, data);

    Http.delete('/users/1', { baseUrl }).then(response => {
      expect(response.data).toEqual(data);
      expect(response.status).toEqual(201);
      done();
    });
  });
});
