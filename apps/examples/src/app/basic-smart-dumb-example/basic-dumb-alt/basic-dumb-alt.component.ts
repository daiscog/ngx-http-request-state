import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Brewery } from '../model/brewery';
import { NgIf } from '@angular/common';
import {
  ErrorComponent,
  SpinnerComponent,
} from '../../loading-state-components';
import { BreweryDetailsComponent } from '../brewery-details/brewery-details.component';

@Component({
  standalone: true,
  imports: [NgIf, ErrorComponent, SpinnerComponent, BreweryDetailsComponent],
  selector: 'examples-basic-dumb-alt',
  templateUrl: './basic-dumb-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicDumbAltComponent {
  @Input()
  brewery?: Brewery;

  @Input()
  loading = true;

  @Input()
  error?: HttpErrorResponse | Error;

  @Output()
  readonly reloadClick = new EventEmitter<MouseEvent>();
}
