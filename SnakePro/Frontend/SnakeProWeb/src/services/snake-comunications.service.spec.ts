import { TestBed } from '@angular/core/testing';

import { SnakeCommunicationsService } from './snake-communications.service';

describe('SnakeComunicationsService', () => {
  let service: SnakeCommunicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeCommunicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
