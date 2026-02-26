import { TestBed } from '@angular/core/testing';

import { AdminStockInterestService } from './admin-stock-interest.service';

describe('AdminStockInterestService', () => {
  let service: AdminStockInterestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminStockInterestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
