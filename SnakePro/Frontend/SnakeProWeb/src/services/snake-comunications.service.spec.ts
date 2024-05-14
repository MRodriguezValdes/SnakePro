import { TestBed } from '@angular/core/testing';

import { SnakeComunicationsService } from './snake-comunications.service';

describe('SnakeComunicationsService', () => {
  let service: SnakeComunicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnakeComunicationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
