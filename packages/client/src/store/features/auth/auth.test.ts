import MockAdapter from 'axios-mock-adapter';

import { UserDTO } from '../../../api/typings';
import { axios, buildPath } from '../../../utils/HTTP';
import { store } from '../../store';
import { API_ENDPOINTS, API_HOST } from './../../../config/constants';
import { authThunks } from './authThunks';

const fakeUserProfile: UserDTO = {
  id: 1,
  display_name: 'User1',
  first_name: 'First Name',
  second_name: 'Second Name',
  email: 'example@mail.com',
  login: 'user1',
  avatar: '',
  phone: '555555',
};

describe('Redux auth state', () => {
  beforeAll(() => {
    const mock = new MockAdapter(axios);
    mock.onGet(buildPath(API_HOST, API_ENDPOINTS.AUTH.ME)).reply(200, fakeUserProfile);
    mock.onPost(buildPath(API_HOST, API_ENDPOINTS.AUTH.SIGNIN)).reply(200);
    mock.onPost(buildPath(API_HOST, API_ENDPOINTS.AUTH.SIGNUP)).reply(200);
    mock.onPost(buildPath(API_HOST, API_ENDPOINTS.AUTH.LOGOUT)).reply(200);
  });

  test('should contain correct initial values', () => {
    const state = store.getState().auth;
    expect(state.isLoading).toEqual(false);
    expect(state.isAuthenticated).toEqual(false);
    expect(state.error).toEqual('');
  });

  test('should correct set values after dispatch "signIn" thunk', async () => {
    await store.dispatch(authThunks.signIn({ login: 'test', password: 'test2' }));

    const state = store.getState();

    expect(state.app.userProfile).toEqual(fakeUserProfile);
    expect(state.app.isLoading).toEqual(false);
    expect(state.auth.isLoading).toEqual(false);
    expect(state.auth.isAuthenticated).toEqual(true);
  });

  test('should correct set values after dispatch "logout" thunk', async () => {
    await store.dispatch(authThunks.logout());

    const state = store.getState();

    expect(state.app.userProfile).toEqual(null);
    expect(state.auth.isAuthenticated).toEqual(false);
    expect(state.app.isLoading).toEqual(false);
    expect(state.auth.isLoading).toEqual(false);
  });

  test('should correct set values after dispatch "me" thunk', async () => {
    await store.dispatch(authThunks.me());

    const state = store.getState();

    expect(state.app.userProfile).toEqual(fakeUserProfile);
    expect(state.app.isLoading).toEqual(false);
    expect(state.auth.isLoading).toEqual(false);
    expect(state.auth.isAuthenticated).toEqual(true);
  });

  test('should correct set values after dispatch "signUp" thunk', async () => {
    await store.dispatch(authThunks.signUp({ ...fakeUserProfile, password: 'fakePassword' }));

    const state = store.getState();

    expect(state.app.userProfile).toEqual(fakeUserProfile);
    expect(state.app.isLoading).toEqual(false);
    expect(state.auth.isLoading).toEqual(false);
    expect(state.auth.isAuthenticated).toEqual(true);
  });
});
