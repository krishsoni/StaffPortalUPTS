import { TestBed, inject } from '@angular/core/testing';

import { LabourRecordService } from './labourrecord-service';
describe('LabourRecordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  it('should be created', inject([LabourRecordService], (service: LabourRecordService) => {
    expect(service).toBeTruthy();
  }));
});
