import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSmartComponent } from './basic-smart/basic-smart.component';
import { BasicDumbComponent } from './basic-dumb/basic-dumb.component';
import { BasicDumbAltComponent } from './basic-dumb-alt/basic-dumb-alt.component';
import { RouterModule } from '@angular/router';
import { LoadingStateModule } from '../loading-state-components/loading-state.module';

@NgModule({
  declarations: [
    BasicSmartComponent,
    BasicDumbComponent,
    BasicDumbAltComponent,
  ],
  imports: [
    CommonModule,
    LoadingStateModule,
    RouterModule.forChild([
      {
        path: '',
        component: BasicSmartComponent,
      },
    ]),
  ],
})
export class BasicSmartDumbExampleModule {}
