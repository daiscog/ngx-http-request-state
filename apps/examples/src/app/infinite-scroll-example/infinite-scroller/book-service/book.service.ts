import { Injectable } from '@angular/core';
import { Book, BookApiResponse } from '../model/book';
import { delay, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

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
        delay(1000), // fake delay to see loading spinner for longer
        tap(() => {
          // occasionally fake an error response
          if (Math.random() < 0.3) {
            throw new HttpErrorResponse({
              status: 500,
              statusText: 'Internal server error',
              error: {
                message: 'Something unexpected happened',
              },
            });
          }
        }),
        map((response) => {
          if (Array.isArray(response.title)) {
            return response.title;
          }
          return response.title ? [response.title] : [];
        })
      );
  }
}
