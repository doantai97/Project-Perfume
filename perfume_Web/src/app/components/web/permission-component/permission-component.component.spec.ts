import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionComponentComponent } from './permission-component.component';

describe('PermissionComponentComponent', () => {
  let component: PermissionComponentComponent;
  let fixture: ComponentFixture<PermissionComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
