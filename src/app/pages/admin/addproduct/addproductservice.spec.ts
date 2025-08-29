import { TestBed } from '@angular/core/testing';

import { Addproductservice } from './addproductservice';

describe('Addproductservice', () => {
  let service: Addproductservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Addproductservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
