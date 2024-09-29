import { ErrorState, LoadedState, LoadingState } from './model';

export function isLoadingState<T>(
  state?: LoadingState<T> | ErrorState<unknown> | LoadedState<unknown>
): state is LoadingState<T> {
  return !!state && state.isLoading;
}

export function isLoadedState<T>(
  state?: LoadedState<T> | LoadingState<unknown> | ErrorState<unknown>
): state is LoadedState<T> {
  return !!state && !state.isLoading && !state.error;
}

export function isErrorState<T>(
  state?: ErrorState<T> | LoadedState<unknown> | LoadingState<unknown>
): state is ErrorState<T> {
  return !!state && !state.isLoading && !!state.error;
}
