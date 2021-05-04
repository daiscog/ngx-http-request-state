import { Injectable } from '@angular/core';
import { Book, BookApiResponse } from '../model/book';
import { delay, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { maybeFakeAnErrorResponse } from '../../../utils/maybeError';

const BOOKS_URL = 'https://reststop.randomhouse.com/resources/titles';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private readonly client: HttpClient) {}

  findBooks(
    searchTerm: string,
    start: number,
    max: number
  ): Observable<Book[]> {
    const searchTermEncoded = encodeURIComponent(searchTerm);
    return this.client
      .get<BookApiResponse>(
        `${BOOKS_URL}?search=${searchTermEncoded}&start=${start}&max=${max}`
      )
      .pipe(
        delay(400), // fake delay to see loading spinner for longer
        maybeFakeAnErrorResponse(0.3),
        map((response) => {
          if (Array.isArray(response.title)) {
            return response.title;
          }
          return response.title ? [response.title] : [];
        })
      );
  }
}
