import { TestBed, inject } from '@angular/core/testing';

import { AuditTrailService } from './audittrail-service';
describe('AuditTrailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  it('should be created', inject([AuditTrailService], (service: AuditTrailService) => {
    expect(service).toBeTruthy();
  }));
});
