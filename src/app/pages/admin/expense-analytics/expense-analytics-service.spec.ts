import { TestBed } from '@angular/core/testing';

import { ExpenseAnalyticsService } from './expense-analytics-service';

describe('ExpenseAnalyticsService', () => {
  let service: ExpenseAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
