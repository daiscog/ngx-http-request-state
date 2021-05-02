import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSmartComponent } from './basic-smart.component';

describe('BasicSmartComponent', () => {
  let component: BasicSmartComponent;
  let fixture: ComponentFixture<BasicSmartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicSmartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicSmartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
