import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CatPic } from '../model/cat-pic';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'examples-basic-dumb-alt',
  templateUrl: './basic-dumb-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbAltComponent {
  @Input()
  catPic?: CatPic;

  @Input()
  loading: boolean;

  @Input()
  error?: HttpErrorResponse | Error;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
