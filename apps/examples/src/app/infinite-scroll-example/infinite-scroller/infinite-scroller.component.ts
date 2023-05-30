import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  debounceTime,
  defer,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  switchScan,
  takeUntil,
  tap,
  combineLatest,
  Observable,
  Subject,
  merge,
  skip,
} from 'rxjs';
import {
  HttpRequestState,
  httpRequestStates,
  isLoadedState,
  loadingState,
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
  private readonly retry$ = new Subject<void>();
  private readonly spinnerVisible$ = new Subject<boolean>();

  private readonly autoLoadMore$ = defer(() =>
    combineLatest([
      this.spinnerVisible$,
      this.state$.pipe(map(isLoadedState), distinctUntilChanged()),
    ]).pipe(
      debounceTime(100),
      filter(([spinnerVisible, isLoaded]) => spinnerVisible && isLoaded),
      map(() => undefined as void)
    )
  );

  private readonly noMoreBooks$ = defer(() =>
    this.state$.pipe(
      skip(1),
      filter(isLoadedState),
      map(({ value }) => value.numFound <= value.docs.length),
      filter((allDone) => allDone)
    )
  );

  readonly state$: Observable<HttpRequestState<BookApiResponse>> = merge(
    this.retry$,
    this.autoLoadMore$
  ).pipe(
    takeUntil(this.noMoreBooks$),
    startWith(undefined as void),
    switchScan(
      (prevState: HttpRequestState<BookApiResponse>) =>
        this.bookService
          .findBooks(
            'Jasper Fforde',
            prevState.value?.docs.length ?? 0,
            PAGE_SIZE
          )
          .pipe(
            httpRequestStates(),
            map((state) => ({
              ...state,
              value: mergeData(prevState.value, state.value),
            }))
          ),
      loadingState<BookApiResponse>()
    ),
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
