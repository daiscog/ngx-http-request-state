import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'examples-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @Input()
  loading = true;
}
