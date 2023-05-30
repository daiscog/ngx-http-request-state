import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleSourcesContainerComponent } from './multiple-sources-container.component';

describe('MultipleSourcesContainerComponent', () => {
  let component: MultipleSourcesContainerComponent;
  let fixture: ComponentFixture<MultipleSourcesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleSourcesContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleSourcesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
