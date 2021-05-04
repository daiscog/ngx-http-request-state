import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'basic',
  },
  {
    path: 'basic',
    loadChildren: () =>
      import('./basic-smart-dumb-example/basic-smart-dumb-example.module').then(
        (mod) => mod.BasicSmartDumbExampleModule
      ),
  },
  {
    path: 'infinite-scrolling',
    loadChildren: () =>
      import('./infinite-scroll-example/infinite-scroll-example.module').then(
        (mod) => mod.InfiniteScrollExampleModule
      ),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
