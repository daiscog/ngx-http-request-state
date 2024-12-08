import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  imports: [NgIf],
  selector: 'examples-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  visible = false;
  title?: string;
  message?: string;

  @Input()
  set error(error: HttpErrorResponse | Error | undefined) {
    if (error instanceof HttpErrorResponse) {
      this.visible = true;
      this.title =
        error.statusText || (error.status ? `Error ${error.status}` : 'Error');
      if (typeof error.error === 'string') {
        this.message = error.error;
      } else {
        this.message = error.error?.message || error.message;
      }
    } else if (error) {
      this.visible = true;
      this.title = 'Error';
      this.message = error.message;
      console.error(error);
    } else {
      this.visible = false;
    }
  }

  @Input()
  showRetryButton = false;

  @Output()
  readonly retry = new EventEmitter<void>();
}
