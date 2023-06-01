import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import {
  ErrorComponent,
  SpinnerComponent,
} from '../../../loading-state-components';
import { HttpRequestState } from 'ngx-http-request-state';
import { BookApiResponse } from '../model/book';
import { BookListComponent } from '../book-list/book-list.component';

@Component({
  standalone: true,
  imports: [ErrorComponent, SpinnerComponent, BookListComponent],
  selector: 'examples-infinite-scroller-layout',
  templateUrl: './infinite-scroller-layout.component.html',
  styleUrls: ['./infinite-scroller-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollerLayoutComponent implements OnInit, OnDestroy {
  @Input()
  state: HttpRequestState<BookApiResponse> | null = null;

  // @Output()
  // readonly loadMore = new EventEmitter<void>();

  @Output()
  readonly spinnerInViewport = new EventEmitter<boolean>();

  @Output()
  readonly retryBtnClicked = new EventEmitter<void>();

  @ViewChild(SpinnerComponent, {
    read: ElementRef,
    static: true,
  })
  spinner!: ElementRef;

  private readonly intersectionObserver = new IntersectionObserver(
    (entries) => {
      this.spinnerInViewport.emit(entries[0].isIntersecting);
      // if (entries[0].isIntersecting && !this.state?.isLoading) {
      //   this.loadMore.emit();
      // }
    }
  );

  ngOnInit() {
    this.intersectionObserver.observe(this.spinner.nativeElement);
  }

  ngOnDestroy() {
    this.intersectionObserver.unobserve(this.spinner.nativeElement);
    this.intersectionObserver.disconnect();
  }
}
