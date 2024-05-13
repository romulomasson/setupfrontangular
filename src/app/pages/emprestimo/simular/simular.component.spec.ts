import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimularComponent } from './simular.component';

describe('SimularComponent', () => {
  let component: SimularComponent;
  let fixture: ComponentFixture<SimularComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
