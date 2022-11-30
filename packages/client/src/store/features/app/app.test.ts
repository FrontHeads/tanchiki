import { store } from '../../store';
import { appActions } from './appSlice';

describe('Redux app state', () => {
  test('should contain correct initial values', () => {
    const state = store.getState().app;
    expect(state.isLoading).toEqual(false);
    expect(state.userProfile).toEqual(null);
  });

  test('should contain correct values', () => {
    store.dispatch(appActions.setIsLoading(true));

    const state = store.getState().app;
    expect(state.isLoading).toEqual(true);
  });
});
