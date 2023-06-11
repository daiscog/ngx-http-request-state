import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchScan,
  takeUntil,
  combineLatest,
  Observable,
  Subject,
  merge,
  first,
} from 'rxjs';
import {
  HttpRequestState,
  httpRequestStates,
  isLoadedState,
} from 'ngx-http-request-state';
import { BookApiResponse } from './model/book';
import { BookService } from './book-service/book.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { InfiniteScrollerLayoutComponent } from './layout/infinite-scroller-layout.component';

const PAGE_SIZE = 5;

@Component({
  standalone: true,
  imports: [AsyncPipe, NgIf, InfiniteScrollerLayoutComponent],
  selector: 'examples-infinite-scroller',
  templateUrl: './infinite-scroller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollerComponent {
  private readonly bookService = inject(BookService);

  /**
   * A subject that emits when the user clicks the 'retry' button
   * in the error message shown when the last request failed.
   */
  private readonly retry$ = new Subject<void>();
  /**
   * A subject that emits true when the loading spinner at the end of the list is
   * scrolled into the viewport, and false when it is scrolled out of the viewport.
   */
  private readonly spinnerVisible$ = new Subject<boolean>();

  /**
   * The trigger to automatically load the next page of results.
   *
   * Emits when:
   *
   *  - There is no inflight request
   *  - The previous request was successful
   *  - The page has been scrolled so far that the loading spinner at the end of the list is visible in the viewport
   *
   */
  private readonly autoLoadMore$: Observable<void> = defer(() =>
    combineLatest([
      this.spinnerVisible$,
      this.state$.pipe(
        map(isLoadedState),
        distinctUntilChanged(),
        // Delay with debounceTime to allow time for the new value to render and possibly push
        // the spinner out of the viewport before we emit again.  Prevents an immediate second
        // request until the spinner is back in the viewport after scrolling again.
        debounceTime(100)
      ),
    ]).pipe(
      filter(([spinnerVisible, isLoaded]) => spinnerVisible && isLoaded),
      map(() => undefined as void)
    )
  );

  /**
   * An Observable that emits when we've loaded all items (no more pages of results are available)
   */
  private readonly noMoreBooks$ = defer(() =>
    this.state$.pipe(
      filter(isLoadedState),
      map(({ value }) => value.numFound <= value.docs.length),
      filter((allDone) => allDone),
      first()
    )
  );

  /**
   * The data loading state.
   *
   * The value property of every state emitted (i.e., each of the Loaded, Loading and Error states) always contains all
   * the data loaded so far.  So every LoadedState contains all the previous pages loaded, including the most recent one.
   */
  readonly state$: Observable<HttpRequestState<BookApiResponse>> = merge(
    this.retry$,
    this.autoLoadMore$
  ).pipe(
    takeUntil(this.noMoreBooks$),
    startWith(undefined as void),
    // Use switchScan so we can cumulatively build up the data in the value property of each state emitted:
    switchScan(
      (prevState: HttpRequestState<BookApiResponse> | undefined) =>
        this.bookService
          .findBooks(
            'Jasper Fforde',
            prevState?.value?.docs.length ?? 0,
            PAGE_SIZE
          )
          .pipe(
            httpRequestStates(),
            map((state) => ({
              ...state,
              // For a loading or error state, add the previously loaded
              // data value to it, so it doesn't disappear from the view.
              //
              // For a loaded state, append the new value to the end of the
              // previous value, giving us an ever-growing list of items.
              value: mergeData(prevState?.value, state.value),
            }))
          ),
      undefined
    ),
    // shareReplay to prevent an infinite recursion of subscriptions
    // (as this observable depends on observables that depend on this)
    shareReplay({
      bufferSize: 1,
      refCount: true,
    })
  );

  retry() {
    this.retry$.next();
  }

  spinnerInViewport(spinnerInViewport: boolean) {
    this.spinnerVisible$.next(spinnerInViewport);
  }
}

function mergeData(
  prev?: BookApiResponse,
  next?: BookApiResponse
): BookApiResponse {
  return {
    numFound: next?.numFound ?? prev?.numFound ?? 0,
    docs: [...(prev?.docs || []), ...(next?.docs || [])],
  };
}
