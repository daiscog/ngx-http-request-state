import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { exhaustMap, startWith } from 'rxjs/operators';
import { HttpRequestState, httpRequestStates } from 'ngx-http-request-state';
import { RandomBreweryService } from '../random-brewery.service';
import { Brewery } from '../model/brewery';
import { BasicDumbComponent } from '../basic-dumb/basic-dumb.component';
import { BasicDumbAltComponent } from '../basic-dumb-alt/basic-dumb-alt.component';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [AsyncPipe, BasicDumbComponent, BasicDumbAltComponent],
  selector: 'examples-basic-smart',
  templateUrl: './basic-smart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSmartComponent {
  constructor(private readonly service: RandomBreweryService) {}

  private readonly loadNewBrewery$ = new Subject<void>();

  readonly brewery$: Observable<HttpRequestState<Brewery>> =
    this.loadNewBrewery$.pipe(
      startWith(undefined as void),
      exhaustMap(() => this.service.randomBrewery().pipe(httpRequestStates()))
    );

  reload() {
    this.loadNewBrewery$.next();
  }
}
