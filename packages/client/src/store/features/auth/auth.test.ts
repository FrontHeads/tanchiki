import { fakeUserProfile } from '../../../tests/data';
import { store } from '../../store';
import { authThunks } from './authThunks';

describe('Redux auth state', () => {
  test('should contain correct initial values', () => {
    const state = store.getState().auth;
    expect(state.isLoading).toEqual(false);
    expect(state.userProfile).toEqual(null);
    expect(state.error).toEqual('');
  });

  test('should correct set values after dispatch "signIn" thunk', async () => {
    await store.dispatch(authThunks.signIn({ login: 'test', password: 'test2' }));

    const state = store.getState();

    expect(state.app.isAppLoading).toEqual(false);
    expect(state.auth.userProfile).toEqual(fakeUserProfile);
    expect(state.auth.isLoading).toEqual(false);
  });

  test('should correct set values after dispatch "logout" thunk', async () => {
    await store.dispatch(authThunks.logout());

    const state = store.getState();

    expect(state.app.isAppLoading).toEqual(false);
    expect(state.auth.userProfile).toEqual(null);
    expect(state.auth.isLoading).toEqual(false);
  });

  test('should correct set values after dispatch "me" thunk', async () => {
    await store.dispatch(authThunks.me());

    const state = store.getState();

    expect(state.app.isAppLoading).toEqual(false);
    expect(state.auth.userProfile).toEqual(fakeUserProfile);
    expect(state.auth.isLoading).toEqual(false);
  });

  test('should correct set values after dispatch "signUp" thunk', async () => {
    await store.dispatch(
      authThunks.signUp({ ...fakeUserProfile, password: 'fakePassword', password_check: 'fakePassword' })
    );

    const state = store.getState();

    expect(state.app.isAppLoading).toEqual(false);
    expect(state.auth.userProfile).toEqual(fakeUserProfile);
    expect(state.auth.isLoading).toEqual(false);
  });
});
