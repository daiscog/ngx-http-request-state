import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { BrewDateForm } from '../model/form';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestState } from 'ngx-http-request-state';
import { Brews } from '../model/brews';
import {
  ErrorComponent,
  SpinnerComponent,
} from '../../loading-state-components';
import { BeerListComponent } from '../beer-list/beer-list.component';

const MONTHS: string[] = Array(12)
  .fill(void 0)
  .map((_, i) => (++i < 10 ? `0${i}` : `${i}`));

const YEARS: string[] = Array(13)
  .fill(2008)
  .map((v, i) => `${v + i}`);

@Component({
  selector: 'examples-multiple-sources-layout',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    SpinnerComponent,
    NgIf,
    ErrorComponent,
    BeerListComponent,
  ],
  templateUrl: './multiple-sources-layout.component.html',
  styleUrls: ['./multiple-sources-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleSourcesLayoutComponent {
  @Input()
  beers: HttpRequestState<Brews & BrewDateForm> | null = null;

  @Output()
  readonly search = new EventEmitter<BrewDateForm>();

  readonly months = MONTHS;
  readonly years = YEARS;

  readonly form = inject(NonNullableFormBuilder).group({
    month: MONTHS[0],
    year: YEARS[0],
  });

  onSubmit() {
    this.search.emit(this.form.value as BrewDateForm);
  }
}
