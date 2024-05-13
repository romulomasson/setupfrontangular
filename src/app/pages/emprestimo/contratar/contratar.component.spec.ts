import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContratarComponent } from './contratar.component';

describe('ContratarComponent', () => {
  let component: ContratarComponent;
  let fixture: ComponentFixture<ContratarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContratarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
