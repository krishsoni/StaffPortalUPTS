import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillExpenseDetailsComponent } from './fillexpensedetails.component';

describe('FillExpenseDetailsComponent', () => {
  let component: FillExpenseDetailsComponent;
  let fixture: ComponentFixture<FillExpenseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillExpenseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillExpenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
