import { TestBed } from '@angular/core/testing';

import { ShippingruleService } from './shippingrule.service';

describe('ShippingruleService', () => {
  let service: ShippingruleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingruleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
