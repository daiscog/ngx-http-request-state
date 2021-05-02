import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDumbAltComponent } from './basic-dumb-alt.component';

describe('BasicDumbAltComponent', () => {
  let component: BasicDumbAltComponent;
  let fixture: ComponentFixture<BasicDumbAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasicDumbAltComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDumbAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
