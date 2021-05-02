import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CatPic } from '../model/cat-pic';
import { HttpRequestState } from 'ngx-http-request-state';

@Component({
  selector: 'examples-basic-dumb',
  templateUrl: './basic-dumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbComponent {
  @Input()
  catPicState: HttpRequestState<CatPic>;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
