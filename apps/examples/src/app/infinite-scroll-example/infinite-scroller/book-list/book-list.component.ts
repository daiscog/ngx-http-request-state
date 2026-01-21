import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Book } from '../model/book';

@Component({
  imports: [],
  selector: 'examples-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  @Input()
  books: Book[] | undefined;

  bookKey(_: number, book: Book): string {
    return book.key;
  }
}
