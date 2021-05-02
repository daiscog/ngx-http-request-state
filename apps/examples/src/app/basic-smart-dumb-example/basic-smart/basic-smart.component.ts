import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { exhaustMap, startWith } from 'rxjs/operators';
import { CatPic } from '../model/cat-pic';
import { HttpRequestState, httpRequestStates } from 'ngx-http-request-state';

@Component({
  selector: 'examples-basic-smart',
  templateUrl: './basic-smart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSmartComponent {
  constructor(private client: HttpClient) {}

  readonly reloadPic$ = new Subject<void>();

  readonly catPic$: Observable<HttpRequestState<CatPic>> = this.reloadPic$.pipe(
    startWith(undefined as void),
    exhaustMap(() =>
      this.client
        .get<CatPic>('https://thatcopy.pw/catapi/rest/')
        .pipe(httpRequestStates())
    )
  );
}
