import { HttpErrorResponse } from '@angular/common/http';

/**
 * Representation of the state of a data-loading operation.
 *
 * The various fields are readonly as this is meant to be used to represent an
 * immutable snapshot of the current state in a stream of state change events.
 */
export interface HttpRequestState<T> {
  /**
   * Whether a request is currently in-flight.  true for a "loading" state,
   * false otherwise.
   */
  readonly isLoading: boolean;
  /**
   * The response data for a "loaded" state, or optionally the last-known data
   * (if any) for a "loading" or "error" state.
   */
  readonly value?: T;
  /**
   * The response error (if any) for an "error" state.
   */
  readonly error?: HttpErrorResponse | Error;
}

/**
 * Represents an in-flight HTTP request to load some data.
 *
 * A <code>value</code> may be provided to represent the previously-known value,
 * or a default value to display whilst loading is in progress (e.g., for a
 * reload operation, or a list of values loaded so far in an infinite scrolling
 * UI).
 *
 */
export interface LoadingState<T> extends HttpRequestState<T> {
  readonly isLoading: true;
  readonly value?: T;
  readonly error: undefined;
}

/**
 * Represents a successfully-completed HTTP request, with the given data.
 *
 * A <code>value</code> may be omitted if there is no data to display and such
 * a scenario is not considered an error condition.
 */
export interface LoadedState<T> extends HttpRequestState<T> {
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
export interface ErrorState<T> extends HttpRequestState<T> {
  readonly isLoading: false;
  readonly value?: T;
  readonly error: HttpErrorResponse | Error;
}
