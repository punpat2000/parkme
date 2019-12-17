import { TestBed } from '@angular/core/testing';

import { CarparkdbService } from './carparkdb.service';

describe('CarparkdbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CarparkdbService = TestBed.get(CarparkdbService);
    expect(service).toBeTruthy();
  });
});
