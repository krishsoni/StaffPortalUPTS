import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Balance } from '../Models/balance';
import { Employee } from '../Models/employee';

@Injectable()
export class BalanceService {

  constructor(private http: HttpClient) { }

  getBalance(): Observable<any>
  {
    return this.http.get(environment.apis.getBalance);
  }
  addBalance(balance: Balance): Observable<any>
  {
    return this.http.post(environment.apis.addBalance, balance);
  }
  getbalbyId(employeeid : Number) : Observable<any>
  {
    return this.http.get(environment.apis.getbalbyId+employeeid);
  }
}
