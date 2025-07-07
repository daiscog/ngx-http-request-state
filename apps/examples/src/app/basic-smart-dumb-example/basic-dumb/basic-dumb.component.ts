import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpRequestState } from 'ngx-http-request-state';
import { Brewery } from '../model/brewery';

import {
  ErrorComponent,
  SpinnerComponent,
} from '../../loading-state-components';
import { BreweryDetailsComponent } from '../brewery-details/brewery-details.component';

@Component({
  imports: [SpinnerComponent, ErrorComponent, BreweryDetailsComponent],
  selector: 'examples-basic-dumb',
  templateUrl: './basic-dumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbComponent {
  @Input()
  brewery!: HttpRequestState<Brewery>;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
