# ngx-http-request-state

An Angular library for wrapping HttpClient responses with loading & error information.

Allows observing the whole lifecycle of HTTP requests as a single observable stream
of state changes, simplifying handling of loading, loaded & error states.

## API

The library declares an `HttpRequestState` interface to reflect the state of an HTTP
request:

```typescript
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
```

There are three subtypes of `HttpRequestStatus` provided with more tightly-defined members,
as well as a set of type-guard predicates:

```typescript
export interface LoadingState<T> extends HttpRequestState<T> {
  readonly isLoading: true;
  readonly value?: T;
  readonly error: undefined;
}

export interface LoadedState<T> extends HttpRequestState<T> {
  readonly isLoading: false;
  readonly value?: T;
  readonly error: undefined;
}

export interface ErrorState<T> extends HttpRequestState<T> {
  readonly isLoading: false;
  readonly value?: T;
  readonly error: HttpErrorResponse | Error;
}

export declare function isLoadingState<T>(
  state?: HttpRequestState<T>
): state is LoadingState<T>;
export declare function isLoadedState<T>(
  state?: HttpRequestState<T>
): state is LoadedState<T>;
export declare function isErrorState<T>(
  state?: HttpRequestState<T>
): state is ErrorState<T>;
```

Finally, a function called `httpRequestStates()` is provided which returns an RxJs operator
that transforms an `Observable<HttpResponse<T>>` into an `Observable<HttpRequestState<T>>`:

```typescript
export class SomeComponent {
  /**
   * Will immediately emit a LoadingState, then either a LoadedState<MyData> or
   * an ErrorState, depending on whether the underlying HTTP request was successful.
   */
  readonly myData$: Observable<
    HttpRequestState<MyData>
  > = this.httpClient.get<MyData>(someUrl).pipe(httpRequestStates());

  constructor(private httpClient: HttpClient) {}
}
```

The associated HTML template can then async-pipe this state to display either a loading
spinner, the data, or an error state:

```html
<ng-container *ngIf="myData$ | async as myData">
  <!-- Show a spinner if state is loading -->
  <my-loading-spinner *ngIf="myData.isLoading"></my-loading-spinner>

  <!-- Show the data if state is loaded -->
  <my-data-view *ngIf="myData.value" [myData]="myData.value"></my-data-view>

  <!-- Show an error message if state is error -->
  <my-error-state *ngIf="myData.error" [error]="myData.error"></my-error-state>
</ng-container>
```

### switchMap safety

The `httpRequestStates()` operator catches errors and replaces them with ordinary (`next`) emission of
an `ErrorState` object instead, so it will never throw an error.

This means when used inside a `switchMap`, no special error handling is required to prevent the outer
observable being unsubscribed following an error response in the inner observable:

```typescript
export class SomeComponent {
  /**
   * Every time the source observable (activatedRoute.params) emits a value,
   * this observable will immediately emit a LoadingState followed later by
   * either a LoadedState<MyData> or an ErrorState.
   *
   * Will continue to emit new HttpRequestStates following values being emitted
   * from the source observable, even if errors were thrown by the http client
   * for earlier requests.
   */
  readonly myData$: Observable<
    HttpRequestState<MyData>
  > = this.activatedRoute.params.pipe(
    pluck('id'),
    switchMap((id) =>
      this.httpClient
        .get<MyData>(`${baseUrl}?id=${id}`)
        .pipe(httpRequestStates())
    )
  );

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}
}
```

## Examples

See [the examples app](https://github.com/daiscog/ngx-http-request-state/tree/main/apps/examples/src/app) for more example use cases.

