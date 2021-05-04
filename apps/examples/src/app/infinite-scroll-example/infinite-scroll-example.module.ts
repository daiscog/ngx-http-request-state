import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollerComponent } from './infinite-scroller/infinite-scroller.component';
import { RouterModule } from '@angular/router';
import { LoadingStateModule } from '../loading-state-components/loading-state.module';
import { BookListComponent } from './infinite-scroller/book-list/book-list.component';
import { InfiniteScrollerLayoutComponent } from './infinite-scroller/layout/infinite-scroller-layout.component';

@NgModule({
  declarations: [
    InfiniteScrollerComponent,
    BookListComponent,
    InfiniteScrollerLayoutComponent,
  ],
  imports: [
    CommonModule,
    LoadingStateModule,
    RouterModule.forChild([
      {
        path: '',
        component: InfiniteScrollerComponent,
      },
    ]),
  ],
})
export class InfiniteScrollExampleModule {}
