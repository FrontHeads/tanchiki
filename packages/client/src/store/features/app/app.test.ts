import { setupStore } from '../../store';
import { appActions } from './appSlice';

const store = setupStore();

describe('Redux app state', () => {
  test('should contain correct initial values', () => {
    const state = store.getState().app;
    expect(state.isAppLoading).toEqual(false);
  });

  test('should contain correct values', () => {
    store.dispatch(appActions.setIsLoading(true));

    const state = store.getState().app;
    expect(state.isAppLoading).toEqual(true);
  });
});
