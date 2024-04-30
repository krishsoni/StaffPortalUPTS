import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../Models/employee';
//import { environment } from '../../../../environments/environment';

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<any>
  {
    return this.http.get(environment.apis.getAllEmployees);
  }
  createEmployee(employee: Employee): Observable<any>
  {
    return this.http.post(environment.apis.createemployee, employee);
  }
  getEmpIdByName(employee : Employee): Observable<any>
  {
    return this.http.post(environment.apis.getEmpId, employee);
  }
  getEmpById(empId:Number): Observable<any>
  {
    return this.http.get(environment.apis.getempbyId+empId);
  }
  updateEmployee(id: Number, employee: Employee): Observable<any>
  {
    return this.http.put(environment.apis.updateEmployee+id, employee);
  }
}
