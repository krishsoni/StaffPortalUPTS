import { TestBed, inject } from '@angular/core/testing';

import { LookupService } from './lookup-service';
describe('LookupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  it('should be created', inject([LookupService], (service: LookupService) => {
    expect(service).toBeTruthy();
  }));
});
