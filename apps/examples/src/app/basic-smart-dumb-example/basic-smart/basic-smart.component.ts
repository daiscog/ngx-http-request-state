import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { exhaustMap, startWith } from 'rxjs/operators';
import { HttpRequestState, httpRequestStates } from 'ngx-http-request-state';
import { RandomImageService } from '../random-image.service';
import { RandomImage } from '../model/random-image';

@Component({
  selector: 'examples-basic-smart',
  templateUrl: './basic-smart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSmartComponent {
  constructor(private readonly service: RandomImageService) {}

  readonly loadNewImage$ = new Subject<void>();

  readonly imageDetails$: Observable<HttpRequestState<RandomImage>> =
    this.loadNewImage$.pipe(
      startWith(undefined as void),
      exhaustMap(() => this.service.getImage().pipe(httpRequestStates()))
    );
}
