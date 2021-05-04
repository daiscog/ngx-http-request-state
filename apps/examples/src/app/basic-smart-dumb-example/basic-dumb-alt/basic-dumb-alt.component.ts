import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RandomImage } from '../model/random-image';

@Component({
  selector: 'examples-basic-dumb-alt',
  templateUrl: './basic-dumb-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbAltComponent {
  @Input()
  imageDetails?: RandomImage;

  @Input()
  loading: boolean;

  @Input()
  error?: HttpErrorResponse | Error;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
