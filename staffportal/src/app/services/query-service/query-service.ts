import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; 
import { User } from '../../services/Models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Balance } from '../Models/balance';
import { Employee } from '../Models/employee';

@Injectable()
export class QueryService {

  constructor(private http: HttpClient) { }

  query(body : any) : Observable<any>
  {
    return this.http.post(environment.apis.query,body);
  }
}
