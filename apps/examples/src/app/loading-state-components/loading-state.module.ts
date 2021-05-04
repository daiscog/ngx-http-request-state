import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { SpinnerComponent } from './spinner/spinner.component';

const components = [ErrorComponent, SpinnerComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class LoadingStateModule {}
