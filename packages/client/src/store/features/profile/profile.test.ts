import { setupStore } from '../../store';
import { profileActions } from './profileSlice';

const store = setupStore();

describe('Redux profile state', () => {
  test('should contain correct initial values', () => {
    const state = store.getState().profile;
    expect(state.isProfileLoading).toEqual(false);
  });

  test('should contain correct values', () => {
    store.dispatch(profileActions.setIsProfileLoading(true));

    const state = store.getState().profile;
    expect(state.isProfileLoading).toEqual(true);
  });

  test('should update results', () => {
    store.dispatch(profileActions.setUpdateResult([{ type: 'error', message: 'hello' }]));
    const firstState = store.getState().profile;
    expect(firstState.updateResult.length).toEqual(1);

    store.dispatch(profileActions.setUpdateResult([]));
    const secondState = store.getState().profile;

    expect(secondState.updateResult.length).toEqual(0);
  });
});
