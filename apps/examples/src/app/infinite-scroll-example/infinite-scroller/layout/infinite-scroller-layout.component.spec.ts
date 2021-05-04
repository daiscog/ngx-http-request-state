import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollerLayoutComponent } from './infinite-scroller-layout.component';

describe('InfiniteScrollerLayoutComponent', () => {
  let component: InfiniteScrollerLayoutComponent;
  let fixture: ComponentFixture<InfiniteScrollerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfiniteScrollerLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfiniteScrollerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
