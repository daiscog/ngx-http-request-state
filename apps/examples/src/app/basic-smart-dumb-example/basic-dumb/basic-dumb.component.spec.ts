import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDumbComponent } from './basic-dumb.component';

describe('BasicDumbComponent', () => {
  let component: BasicDumbComponent;
  let fixture: ComponentFixture<BasicDumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicDumbComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
