import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAnalytics } from './expense-analytics';

describe('ExpenseAnalytics', () => {
  let component: ExpenseAnalytics;
  let fixture: ComponentFixture<ExpenseAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
