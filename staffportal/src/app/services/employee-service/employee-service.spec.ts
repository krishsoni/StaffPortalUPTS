import { TestBed, inject } from '@angular/core/testing';

import { EmployeeService } from './employee-service';
describe('EmployeeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  it('should be created', inject([EmployeeService], (service: EmployeeService) => {
    expect(service).toBeTruthy();
  }));
});
