import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RandomImage } from './model/random-image';
import { delay } from 'rxjs/operators';
import { maybeFakeAnErrorResponse } from '../utils/maybeError';

@Injectable({
  providedIn: 'root',
})
export class RandomImageService {
  constructor(private readonly httpClient: HttpClient) {}

  getImage(): Observable<RandomImage> {
    return this.httpClient
      .get<RandomImage>('https://foodish-api.herokuapp.com/api')
      .pipe(
        delay(400), // fake delay to see loading spinner for longer
        maybeFakeAnErrorResponse(0.2)
      );
  }
}
