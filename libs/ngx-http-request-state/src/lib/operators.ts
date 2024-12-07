import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { HttpRequestState } from './model';
import { loadingState, loadedState, errorState } from './builders';

export function httpRequestStates<T>(): (
  source: Observable<HttpResponse<T> | T>
) => Observable<HttpRequestState<T>>;
/**
 *
 * @param mapResponse a function to map from HttpResponse<T> to K
 * @deprecated use rxjs's map() operator to transform the response prior to using httpRequestStates() instead.
 */
export function httpRequestStates<T, K>(
  mapResponse: (result: HttpResponse<T>) => K
): (source: Observable<HttpResponse<T>>) => Observable<HttpRequestState<K>>;
/**
 *
 * @param mapResponse a function to map from T to K
 * @deprecated use rxjs's map() operator to transform the value prior to using httpRequestStates() instead.
 */
export function httpRequestStates<T, K>(
  mapResponse: (result: T) => K
): (source: Observable<T>) => Observable<HttpRequestState<K>>;
export function httpRequestStates<T, K>(
  mapResponse?: (result: HttpResponse<T> | T) => K
): (
  source: Observable<HttpResponse<T> | T>
) => Observable<HttpRequestState<T | K>> {
  return (source: Observable<HttpResponse<T> | T>) =>
    source.pipe(
      map((result) =>
        loadedState<T | K>(
          mapResponse
            ? mapResponse(result)
            : result instanceof HttpResponse
            ? (result.body as T)
            : result
        )
      ),
      startWith(loadingState<T | K>()),
      catchError((err) => of(errorState<T | K>(err)))
    );
}
