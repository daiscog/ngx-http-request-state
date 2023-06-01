# ngx-http-request-state

An Angular library for wrapping HttpClient responses with loading & error information.

Allows observing the whole lifecycle of HTTP requests as a single observable stream
of state changes, simplifying handling of loading, loaded & error states.

## Versions

Version `^3.0.0` supports Angular 14, 15 & 16.
Version `^2.1.0` supports Angular 14 & 15.
Version `1.2.0` supports Angular 8 to 13.
Angular versions 7 and earlier are not supported.

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
  readonly value: T;
  readonly error: undefined;
}

export interface ErrorState<T> extends HttpRequestState<T> {
  readonly isLoading: false;
  readonly value?: T;
  readonly error: HttpErrorResponse | Error;
}

export declare function isLoadingState<T>(state?: HttpRequestState<T>): state is LoadingState<T>;
export declare function isLoadedState<T>(state?: HttpRequestState<T>): state is LoadedState<T>;
export declare function isErrorState<T>(state?: HttpRequestState<T>): state is ErrorState<T>;
```

Finally, a function called `httpRequestStates()` is provided which returns an RxJs operator
that transforms an `Observable<HttpResponse<T>>` into an `Observable<HttpRequestState<T>>`:

```typescript
export class SomeComponent {
  /**
   * Will immediately emit a LoadingState, then either a LoadedState<MyData> or
   * an ErrorState, depending on whether the underlying HTTP request was successful.
   */
  readonly myData$: Observable<HttpRequestState<MyData>> = this.httpClient
    .get<MyData>(someUrl)
    .pipe(httpRequestStates());

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

### Merging

The intention of this library is to provide a _view model_ loading state, where you prep all the data
first then, pipe it through `httpRequestStates` towards the end, instead of piping it at the lowest level,
for instance in an API service.

If you however already have multiple `HttpRequestState<T>` objects and would like to merge the values together,
then `mergeStates` can be used.

Consider the following example where we assume we have no control over `MyDataService` and it already wraps requests in `HttpRequestState`:

```typescript
// Third party
@Injectable()
export class MyDataService {
  constructor(private httpClient: HttpClient) {}

  getMyData(someParameter: any) {
    return this.httpClient.get<MyData>(someUrl + someParameter).pipe(httpRequestStates());
  }
}

// Our component
export class SomeComponent {
  readonly myDataCollection$ = combineLatest([
    this.myDataService.getMyData('red'),
    this.myDataService.getMyData('blue'),
  ]).pipe(
    map((states) =>
      mergeStates(states, (dataArray) => {
        // Merge list of data together then return a new instance of MyData
      })
    )
  );

  constructor(private myDataService: MyDataService) {}
}
```

(We use `combineLatest` instead of `forkJoin` to get loading updates)

Using `mergeStates` allows you to act "inside" the `HttpRequestState`, directly on the values or the errors.

As long as one of the states are loading, the resulting merged state will be a `LoadingState`.
When all finish successfully, the callback of the second argument is called with all the available values.

If an error occurs in any of the requests, the merged state will be an `ErrorState`.
By default the first of the errors will be returned.
It is possible to override this with the third argument.

Example:

```typescript
export class SomeComponent {
  readonly myDataCollection$ = combineLatest([
    this.myDataService.getMyData('will-fail'),
    this.myDataService.getMyData('will-also-fail'),
    this.myDataService.getMyData('blue'),
  ]).pipe(
    map((states) =>
      mergeStates(
        states,
        (dataArray) => {
          // Merge list of data together then return a new instance of MyData
        },
        (errors) => {
          // Combine the errors and return a new instance of HttpErrorResponse or Error
        }
      )
    )
  );

  constructor(private myDataService: MyDataService) {}
}
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
  readonly myData$: Observable<HttpRequestState<MyData>> = this.activatedRoute.params.pipe(
    pluck('id'),
    switchMap((id) => this.httpClient.get<MyData>(`${baseUrl}?id=${id}`).pipe(httpRequestStates()))
  );

  constructor(private httpClient: HttpClient, private activatedRoute: ActivatedRoute) {}
}
```

## Examples

See [the examples app](https://github.com/daiscog/ngx-http-request-state/tree/main/apps/examples/src/app) for more example use cases.
