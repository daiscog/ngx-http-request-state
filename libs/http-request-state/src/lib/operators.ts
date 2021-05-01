import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { HttpRequestState } from './model';
import { loadingState, loadedState, errorState } from './builders';

export function httpRequestStates<T>(): (
  source: Observable<HttpResponse<T> | T>
) => Observable<HttpRequestState<T>>;
export function httpRequestStates<T, K>(
  mapResponse: (result: HttpResponse<T> | T) => K
): (source: Observable<HttpResponse<T> | T>) => Observable<HttpRequestState<K>>;
export function httpRequestStates<T, K>(
  mapResponse?: (result: HttpResponse<T> | T) => K
): (
  source: Observable<HttpResponse<T> | T>
) => Observable<HttpRequestState<T | K>> {
  return (source: Observable<HttpResponse<T>>) =>
    source.pipe(
      map((result) =>
        loadedState<T | K>(
          mapResponse
            ? mapResponse(result)
            : result instanceof HttpResponse
            ? result.body
            : result
        )
      ),
      startWith(loadingState<T | K>()),
      catchError((err) => of(errorState<T | K>(err)))
    );
}
