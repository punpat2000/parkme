import { TestBed } from '@angular/core/testing';

import { ProfiledbService } from './profiledb.service';

describe('ProfiledbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfiledbService = TestBed.get(ProfiledbService);
    expect(service).toBeTruthy();
  });
});
