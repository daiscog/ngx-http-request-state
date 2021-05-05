import { HttpErrorResponse } from '@angular/common/http';

/**
 * Representation of the state of a data-loading operation.
 */
export interface HttpRequestState<T> {
  /**
   * Whether the request is currently in-flight.
   */
  isLoading: boolean;
  /**
   * The most-recently loaded value (if any).
   */
  value?: T;
  /**
   * The most recent loading error.
   */
  error?: HttpErrorResponse | Error;
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
  isLoading: true;
  value?: T;
  error: undefined;
}

/**
 * Represents a successfully-completed HTTP request, with the given data.
 *
 * A <code>value</code> may be omitted if there is no data to display and such
 * a scenario is not considered an error condition.
 */
export interface LoadedState<T> extends HttpRequestState<T> {
  isLoading: false;
  value?: T;
  error: undefined;
}

/**
 * Represents an unsuccessful HTTP request with the failure details given in the
 * <code>error</code> property.
 *
 * A <code>value</code> may be set to represent a last-known value, or similar.
 */
export interface ErrorState<T> extends HttpRequestState<T> {
  isLoading: false;
  value?: T;
  error: HttpErrorResponse | Error;
}
