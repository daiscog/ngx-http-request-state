import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'examples-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  visible: boolean;
  title: string;
  message: string;

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
    } else {
      this.visible = false;
    }
  }

  @Input()
  showRetryButton: boolean;

  @Output()
  readonly retry = new EventEmitter<void>();
}
