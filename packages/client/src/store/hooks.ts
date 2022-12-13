import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { type AppDispatch, type RootState } from './store';

/**
 * Через эти хуки взаимодействуем с хранилищем из компонентов.
 * Dispatch - добавить данные в хранилище.
 * Selector - получить данные из хранилища.
 */

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// because useAppDispatch and useAppSelector have extra types for this app.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
