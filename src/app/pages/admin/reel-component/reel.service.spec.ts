import { TestBed } from '@angular/core/testing';

import { ReelService } from './reel.service';

describe('ReelService', () => {
  let service: ReelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
