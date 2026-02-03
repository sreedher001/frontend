import { TestBed } from '@angular/core/testing';

import { Return } from './return';

describe('Return', () => {
  let service: Return;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Return);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
