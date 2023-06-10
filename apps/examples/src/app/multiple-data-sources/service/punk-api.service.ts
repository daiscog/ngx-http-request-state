import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beer } from '../model/brews';

const BASE_URL = 'https://api.punkapi.com/v2';

@Injectable({
  providedIn: 'root',
})
export class PunkApiService {
  private readonly http = inject(HttpClient);

  brewedBefore(month: string, year: string): Observable<Beer[]> {
    return this.http.get<Beer[]>(
      `${BASE_URL}/beers?brewed_before=${month}-${year}`
    );
  }

  brewedAfter(month: string, year: string): Observable<Beer[]> {
    return this.http.get<Beer[]>(
      `${BASE_URL}/beers?brewed_after=${month}-${year}`
    );
  }
}
