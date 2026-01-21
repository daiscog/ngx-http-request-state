import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brewery, RandomBreweryResponse } from './model/brewery';
import { delay, map } from 'rxjs/operators';
import { maybeFakeAnErrorResponse } from '../utils/maybeError';

@Injectable({
  providedIn: 'root',
})
export class RandomBreweryService {
  readonly #httpClient = inject(HttpClient);

  randomBrewery(): Observable<Brewery> {
    return this.#httpClient
      .get<RandomBreweryResponse>(
        'https://api.openbrewerydb.org/v1/breweries/random',
        {
          headers: {
            'Cache-Control': 'no-store, no-cache',
          },
        }
      )
      .pipe(
        delay(400), // fake delay to see loading spinner for longer
        maybeFakeAnErrorResponse(0.2),
        map(([brewery]) => brewery)
      );
  }
}
