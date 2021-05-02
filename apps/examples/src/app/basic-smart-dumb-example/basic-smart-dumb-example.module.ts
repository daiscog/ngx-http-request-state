import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicSmartComponent } from './basic-smart/basic-smart.component';
import { BasicDumbComponent } from './basic-dumb/basic-dumb.component';
import { BasicDumbAltComponent } from './basic-dumb-alt/basic-dumb-alt.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BasicSmartComponent,
    BasicDumbComponent,
    BasicDumbAltComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BasicSmartComponent,
      },
    ]),
  ],
})
export class BasicSmartDumbExampleModule {}
