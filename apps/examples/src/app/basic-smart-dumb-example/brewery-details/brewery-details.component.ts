import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Brewery } from '../model/brewery';

@Component({
  selector: 'examples-brewery-details',
  imports: [],
  templateUrl: './brewery-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreweryDetailsComponent {
  @Input() brewery!: Brewery;
}
