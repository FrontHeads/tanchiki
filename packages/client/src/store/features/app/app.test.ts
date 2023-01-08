import { store } from '../../store';
import { appActions } from './appSlice';

describe('Redux app state', () => {
  test('should contain correct initial values', () => {
    const state = store.getState().app;
    expect(state.isAppLoading).toEqual(true);
  });

  test('should contain correct values', () => {
    store.dispatch(appActions.setIsLoading(true));

    const state = store.getState().app;
    expect(state.isAppLoading).toEqual(true);
  });
});
