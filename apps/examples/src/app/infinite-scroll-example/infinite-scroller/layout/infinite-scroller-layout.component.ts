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
import { SpinnerComponent } from '../../../loading-state-components/spinner/spinner.component';
import { HttpRequestState } from 'ngx-http-request-state';
import { Book } from '../model/book';

@Component({
  selector: 'examples-infinite-scroller-layout',
  templateUrl: './infinite-scroller-layout.component.html',
  styleUrls: ['./infinite-scroller-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollerLayoutComponent implements OnInit, OnDestroy {
  @Input()
  state: HttpRequestState<Book[]>;

  @Output()
  readonly spinnerInViewport = new EventEmitter<boolean>();

  @Output()
  readonly retryAfterError = new EventEmitter<void>();

  @ViewChild(SpinnerComponent, {
    read: ElementRef,
    static: true,
  })
  spinner: ElementRef;

  private readonly intersectionObserver = new IntersectionObserver(
    (entries) => {
      this.spinnerInViewport.emit(entries[0].isIntersecting);
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
