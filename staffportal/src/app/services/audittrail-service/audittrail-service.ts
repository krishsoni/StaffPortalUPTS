import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Balance } from '../Models/balance';
import { Employee } from '../Models/employee';

@Injectable()
export class AuditTrailService {

  constructor(private http: HttpClient) { }

  getEmployeeUpdates(): Observable<any>
  {
    return this.http.get(environment.apis.getEmpUpdates);
  }
  
}
