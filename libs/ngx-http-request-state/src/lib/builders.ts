import {
  ErrorState,
  ErrorStateWithValue,
  LoadedState,
  LoadingState,
  LoadingStateWithValue,
} from './model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Returns a new LoadingState instance with an optional last-known value.
 *
 * @param value may be provided to indicate the previously-loaded, or last-known, state
 */
export function loadingState<T>(value: T): LoadingStateWithValue<T>;
export function loadingState<T = never>(): LoadingState<T>;
export function loadingState<T = never>(value?: T): LoadingState<T> {
  return {
    isLoading: true,
    value,
    error: undefined,
  };
}

/**
 * Returns a new LoadedState instance, with the optional value as the loaded data.
 *
 * @param value
 */
export function loadedState<T>(value: T): LoadedState<T> {
  return {
    isLoading: false,
    error: undefined,
    value,
  };
}

/**
 * Returns a new ErrorState instance with the given error and optional last-known value.
 *
 * @param error
 * @param value may be provided to indicate the previously-loaded, or last-known, state
 */
export function errorState<T>(
  error: HttpErrorResponse | Error,
  value: T
): ErrorStateWithValue<T>;
export function errorState<T = never>(
  error: HttpErrorResponse | Error
): ErrorState<T>;
export function errorState<T = never>(
  error: HttpErrorResponse | Error,
  value?: T
): ErrorState<T> {
  return {
    isLoading: false,
    error,
    value,
  };
}
