import { TestBed } from '@angular/core/testing';

import { DeepSeekServiceService } from './deep-seek-service.service';

describe('DeepSeekServiceService', () => {
  let service: DeepSeekServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeepSeekServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
