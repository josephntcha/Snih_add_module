import { TestBed } from '@angular/core/testing';

import { KkiapayServiceService } from './kkiapay-service.service';

describe('KkiapayServiceService', () => {
  let service: KkiapayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KkiapayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
