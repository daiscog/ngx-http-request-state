import { Injectable, inject } from '@angular/core';
import { BookApiResponse } from '../model/book';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { maybeFakeAnErrorResponse } from '../../../utils/maybeError';

const BOOKS_URL = 'https://openlibrary.org/search.json';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  readonly #http = inject(HttpClient);

  findBooks(
    searchTerm: string,
    start: number,
    max: number
  ): Observable<BookApiResponse> {
    const searchTermEncoded = encodeURIComponent(searchTerm);
    const page = start / max + 1;
    return this.#http
      .get<BookApiResponse>(
        `${BOOKS_URL}?author=${searchTermEncoded}&page=${page}&limit=${max}`
      )
      .pipe(
        // Fake delay to see loading spinner for longer.  Don't do this in a real app!
        delay(400),
        // Sometimes randomly throwError so that we can demonstrate the retry mechanism:
        maybeFakeAnErrorResponse(0.2)
      );
  }
}
