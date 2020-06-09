import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselMultipleComponent } from './carousel-multiple.component';

describe('CarouselMultipleComponent', () => {
  let component: CarouselMultipleComponent;
  let fixture: ComponentFixture<CarouselMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarouselMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
