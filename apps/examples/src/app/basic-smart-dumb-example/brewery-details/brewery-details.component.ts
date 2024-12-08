import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Brewery } from '../model/brewery';
import { NgIf } from '@angular/common';

@Component({
  selector: 'examples-brewery-details',
  imports: [NgIf],
  templateUrl: './brewery-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreweryDetailsComponent {
  @Input() brewery!: Brewery;
}
