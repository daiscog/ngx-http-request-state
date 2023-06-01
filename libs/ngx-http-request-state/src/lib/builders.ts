import { ErrorState, LoadedState, LoadingState } from './model';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Returns a new LoadingState instance with an optional last-known value.
 *
 * @param value may be provided to indicate the previously-loaded, or last-known, state
 */
export const loadingState = <T = any>(value?: T): LoadingState<T> => ({
  isLoading: true,
  value,
  error: undefined,
});

/**
 * Returns a new LoadedState instance, with the optional value as the loaded data.
 *
 * @param value
 */
export const loadedState = <T>(value: T): LoadedState<T> => ({
  isLoading: false,
  error: undefined,
  value,
});

/**
 * Returns a new ErrorState instance with the given error and optional last-known value.
 *
 * @param error
 * @param value may be provided to indicate the previously-loaded, or last-known, state
 */
export const errorState = <T = any>(
  error: HttpErrorResponse | Error,
  value?: T
): ErrorState<T> => ({
  isLoading: false,
  error,
  value,
});
