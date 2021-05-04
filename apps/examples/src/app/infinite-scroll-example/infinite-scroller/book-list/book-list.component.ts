import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Book } from '../model/book';

@Component({
  selector: 'examples-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListComponent {
  @Input()
  books: Book[];
}
