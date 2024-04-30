import { TestBed, inject } from '@angular/core/testing';

import { ExpenseService } from './expense-service';
describe('ExpenseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
    });
  });

  it('should be created', inject([ExpenseService], (service: ExpenseService) => {
    expect(service).toBeTruthy();
  }));
});
