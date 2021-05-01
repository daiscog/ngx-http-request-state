import {
  ErrorState,
  HttpRequestState,
  LoadedState,
  LoadingState,
} from './model';

export function isLoadingState<T>(
  state?: HttpRequestState<T>
): state is LoadingState<T> {
  return !!state && state.isLoading;
}

export function isLoadedState<T>(
  state?: HttpRequestState<T>
): state is LoadedState<T> {
  return !!state && !state.isLoading && !state.error;
}

export function isErrorState<T>(
  state?: HttpRequestState<T>
): state is ErrorState<T> {
  return !!state && !state.isLoading && !!state.error;
}
