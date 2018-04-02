import { TestBed, inject } from '@angular/core/testing';

import { BearerAuthService } from './bearer-auth.service';

describe('BearerAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BearerAuthService]
    });
  });

  it('should be created', inject([BearerAuthService], (service: BearerAuthService) => {
    expect(service).toBeTruthy();
  }));
});
