import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpRequestState } from 'ngx-http-request-state';
import { RandomImage } from '../model/random-image';

@Component({
  selector: 'examples-basic-dumb',
  templateUrl: './basic-dumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbComponent {
  @Input()
  imageDetails: HttpRequestState<RandomImage>;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
