import { HttpErrorResponse } from '@angular/common/http';

/**
 * Represents an in-flight HTTP request to load some data.
 *
 * A <code>value</code> may be provided to represent the previously-known value,
 * or a default value to display whilst loading is in progress (e.g., for a
 * reload operation, or a list of values loaded so far in an infinite scrolling
 * UI).
 *
 */
export interface LoadingState<T> {
  readonly isLoading: true;
  readonly value?: T;
  readonly error: undefined;
}

/**
 * Represents an in-flight HTTP request to load some data, with some existing
 * known data already present.
 *
 * Useful for loading states with a default value to render while waiting, or
 * to represent a loading state with previously-loaded data when using a
 * 'load more' (e.g., infinite scroll) pattern.
 */
export interface LoadingStateWithValue<T> extends LoadingState<T> {
  readonly value: T;
}

/**
 * Represents a successfully-completed HTTP request, with the given data.
 *
 * A <code>value</code> may be omitted if there is no data to display and such
 * a scenario is not considered an error condition.
 */
export interface LoadedState<T> {
  readonly isLoading: false;
  readonly value: T;
  readonly error: undefined;
}

/**
 * Represents an unsuccessful HTTP request with the failure details given in the
 * <code>error</code> property.
 *
 * A <code>value</code> may be set to represent a last-known value, or similar.
 */
export interface ErrorState<T> {
  readonly isLoading: false;
  readonly value?: T;
  readonly error: HttpErrorResponse | Error;
}

/**
 * Represents an unsuccessful HTTP request with the failure details given in the
 * <code>error</code> property, with some pre-existing known data already present.
 *
 * Useful for error states with a fallback value to render, or to represent an
 * error state with previously-loaded data when using a 'load more' (e.g.,
 * infinite scroll) pattern.
 */
export interface ErrorStateWithValue<T> extends ErrorState<T> {
  readonly value: T;
}

/**
 * Representation of the state of a data-loading operation.
 *
 * The various fields are readonly as this is meant to be used to represent an
 * immutable snapshot of the current state in a stream of state change events.
 */
export type HttpRequestState<T> =
  | LoadingState<T>
  | LoadedState<T>
  | ErrorState<T>;
