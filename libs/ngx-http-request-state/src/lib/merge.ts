import {
  HttpRequestState,
  LoadedState,
  ErrorState,
  LoadingState,
} from './model';
import { isLoadedState, isErrorState } from './type-guards';

/**
 * Given an array of HttpRequestState<T>, merge them together into a new single HttpRequestState<T>,
 * based on a supplied merging strategy of values (mergeValues) or of errors (mergeErrors).
 *
 * One can think of this function as allowing one to act "inside" the states, directly on the values or errors.
 *
 * Use this with combineLatest, instead of forkJoin, to get loading updates.
 *
 * @param states Array of states of the same type that should be merged together.
 * @param mergeValues Handles how to merge values together when all states have loaded.
 * @param mergeErrors Handles how to merge errors together in case one or more of the states end up in ErrorState.
 *    If not specified, the first error is simply used as the error of the merged state
 * @returns The merged HttpRequestState<T>
 */
export function mergeStates<T>(
  states: HttpRequestState<T>[],
  mergeValues: (states: LoadedState<T>['value'][]) => LoadedState<T>['value'],
  mergeErrors?: (states: ErrorState<T>['error'][]) => ErrorState<T>['error']
): HttpRequestState<T> {
  if (states.every(isLoadedState)) {
    const state: LoadedState<T> = {
      isLoading: false,
      value: mergeValues(states.map((s) => s.value)),
      error: undefined,
    };
    return state;
  }

  if (states.some(isErrorState)) {
    if (mergeErrors === undefined) {
      mergeErrors = (errors: ErrorState<T>['error'][]) => errors[0];
    }

    const errorStates = states.filter(isErrorState);
    const state: ErrorState<T> = {
      isLoading: false,
      value: undefined,
      error: mergeErrors(errorStates.map((s) => s.error)),
    };
    return state;
  }

  // If one of the state is still not loaded and there are no errors
  // the merged state is still considered loading.
  const state: LoadingState<T> = {
    isLoading: true,
    value: undefined,
    error: undefined,
  };

  return state;
}
