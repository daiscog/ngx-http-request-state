import { Injectable } from '@angular/core';
import { Book, BookApiResponse } from '../model/book';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { maybeFakeAnErrorResponse } from '../../../utils/maybeError';

const BOOKS_URL = 'https://openlibrary.org/search.json';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private readonly client: HttpClient) {}

  findBooks(
    searchTerm: string,
    start: number,
    max: number
  ): Observable<BookApiResponse> {
    const searchTermEncoded = encodeURIComponent(searchTerm);
    const page = start / max + 1;
    return this.client
      .get<BookApiResponse>(
        `${BOOKS_URL}?author=${searchTermEncoded}&page=${page}&limit=${max}`
      )
      .pipe(
        delay(400), // fake delay to see loading spinner for longer
        maybeFakeAnErrorResponse(0.0)
      );
  }
}
