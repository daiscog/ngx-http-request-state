import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultipleSourcesLayoutComponent } from '../layout/multiple-sources-layout.component';
import { BrewDateForm } from '../model/form';
import { combineLatest, Observable, Subject, switchMap } from 'rxjs';
import { Brews } from '../model/brews';
import { HttpRequestState, httpRequestStates } from 'ngx-http-request-state';
import { PunkApiService } from '../service/punk-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'examples-multiple-sources-container',
  standalone: true,
  imports: [CommonModule, MultipleSourcesLayoutComponent],
  templateUrl: './multiple-sources-container.component.html',
  styleUrls: ['./multiple-sources-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultipleSourcesContainerComponent {
  private readonly search$ = new Subject<BrewDateForm>();

  constructor(private readonly punkApi: PunkApiService) {}

  readonly beers$: Observable<HttpRequestState<Brews & BrewDateForm>> =
    this.search$.pipe(switchMap((params) => this.getBeers(params)));

  search(params: BrewDateForm) {
    this.search$.next(params);
  }

  /**
   * Gets data from multiple sources (two different service calls), combines all the
   * data into one object, and then wraps that object in HttpRequestStates.
   *
   */
  private getBeers({
    month,
    year,
  }: BrewDateForm): Observable<HttpRequestState<Brews & BrewDateForm>> {
    return combineLatest([
      this.punkApi.brewedBefore(month, year),
      this.punkApi.brewedAfter(month, year),
    ]).pipe(
      map(([before, after]) => ({
        before,
        after,
        month,
        year,
      })),
      httpRequestStates()
    );
  }
}
