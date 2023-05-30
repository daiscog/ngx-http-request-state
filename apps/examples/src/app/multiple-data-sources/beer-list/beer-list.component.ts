import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { Beer } from '../model/brews';

@Component({
  selector: 'examples-beer-list',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeerListComponent {
  @Input() beers: Beer[] = [];
}
