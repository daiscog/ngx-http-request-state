import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  filter,
  first,
  map,
  shareReplay,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { combineLatest, merge, Observable, of, race, Subject } from 'rxjs';
import {
  HttpRequestState,
  httpRequestStates,
  isErrorState,
  isLoadedState,
} from 'ngx-http-request-state';
import { Book } from './model/book';
import { BookService } from './book-service/book.service';

const PAGE_SIZE = 5;

@Component({
  selector: 'examples-infinite-scroller',
  templateUrl: './infinite-scroller.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollerComponent implements OnDestroy {
  readonly spinnerInViewport$ = new Subject<boolean>();
  readonly retryAfterError$ = new Subject<void>();

  private readonly loadMoreTrigger$ = new Subject<Book[]>();
  private readonly nextPage$: Observable<{
    loadedSoFar: Book[];
    nextPageState: HttpRequestState<Book[]>;
  }> = this.loadMoreTrigger$.pipe(
    switchMap((loadedSoFar: Book[]) => {
      return this.bookService
        .findBooks('Pratchett', loadedSoFar.length, PAGE_SIZE)
        .pipe(
          httpRequestStates(),
          map((nextPageState) => ({ loadedSoFar, nextPageState }))
        );
    }),
    shareReplay(1)
  );

  readonly state$: Observable<HttpRequestState<Book[]>> = this.nextPage$.pipe(
    map(({ loadedSoFar, nextPageState }) => ({
      ...nextPageState,
      value: [...loadedSoFar, ...(nextPageState.value || [])],
    })),
    shareReplay(1)
  );

  private readonly noMoreBooks$ = this.nextPage$.pipe(
    map(({ nextPageState }) => nextPageState),
    filter(isLoadedState),
    filter((state) => state.value.length < PAGE_SIZE),
    first()
  );

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly bookService: BookService) {
    const autoReloadTrigger$: Observable<Book[]> = combineLatest([
      this.state$,
      this.spinnerInViewport$,
    ]).pipe(
      filter(
        ([state, spinnerInViewport]) =>
          spinnerInViewport && isLoadedState(state)
      ),
      map(([state]) => state.value)
    );
    const retryAfterErrorTrigger$: Observable<
      Book[]
    > = this.retryAfterError$.pipe(
      withLatestFrom(this.state$),
      filter(([, state]) => isErrorState(state)),
      map(([, state]) => state.value)
    );
    const initialLoadTrigger$: Observable<Book[]> = of([]);
    merge(initialLoadTrigger$, autoReloadTrigger$, retryAfterErrorTrigger$)
      .pipe(takeUntil(race(this.noMoreBooks$, this.destroyed$)))
      .subscribe(this.loadMoreTrigger$);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
